module.exports = async (fastify, opts) => {
  // define the about route
  fastify.get("/properties", async (request, reply) => {
    const queryString = `SELECT * from properties limit 100`;
    const { rows: props, fields } = await fastify.epDbConn.query(queryString);

    let xml_str =
      "<?xml version='1.0' encoding='utf-8' standalone='yes'?><root><kyero><feed_version>3</feed_version>";

    props?.forEach((prop) => {
      xml_str += prop?.xml_data || "";
    });
    xml_str += "</kyero></root>";

    xml_str = xml_str.replaceAll("&", "&amp;");

    xml_str = xml_str.replaceAll('"', "&quot;");
    xml_str = xml_str.replaceAll(",", "&apos;");
    // xml_str = xml_str.replaceAll("\n", "<br />");
    // xml_str = xml_str.replaceAll("\n\r", "");
    // xml_str = xml_str.replaceAll("\r\n", "");
    // xml_str = xml_str.replaceAll("\n", "");

    // console.log(xml_str);
    // xml_str = xml_str.replaceAll("<", "&lt");
    // xml_str = xml_str.replaceAll(">", "&gt");

    reply.type("application/xml").send(xml_str);
  });
  // define the about route
  fastify.post("/properties", async (request, reply) => {
    //* Check org_id in query/params/body
    const properties = request?.body || [];
    let insert_properties = [];
    let count = 0;
    datas = [];
    if (properties?.length) {
      for (const property of properties) {
        const {
          id: crm_record_id,
          Status: status,
          Modified_Time: modified_time,
          xml_data,
        } = property;
        insert_properties.push(
          `($${++count},$${++count},$${++count},$${++count})`
        );
        datas.push(crm_record_id);
        datas.push(status);
        datas.push(modified_time);
        datas.push(xml_data);
      }
      const queryString = `INSERT INTO properties (crm_record_id, status, modified_time, xml_data ) values ${insert_properties.join(
        ","
      )} ON CONFLICT (crm_record_id) DO UPDATE SET xml_data = excluded.xml_data `;
      const { rows: props, fields } = await fastify.epDbConn.query(
        queryString,
        datas
      );
      return { error: null, data: properties };
    }

    return {
      data: properties,
      error: null,
    };
  });
};
