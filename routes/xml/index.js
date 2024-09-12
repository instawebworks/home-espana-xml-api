module.exports = async (fastify, opts) => {
  // define the about route
  fastify.get("/properties", async (request, reply) => {
    return {
      data: { token: "accessTokenResp.accessToken" },
      error: null,
    };
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
        const { id: crm_record_id, status, xml_data } = property;
        insert_properties.push(`($${++count},$${++count},$${++count})`);
        datas.push(crm_record_id);
        datas.push(status);
        datas.push(xml_data);
      }
      const queryString = `INSERT INTO properties (crm_record_id, status, xml_data ) values ${insert_properties.join(
        ","
      )} ON CONFLICT (crm_record_id) DO UPDATE SET xml_data = excluded.xml_data `;
      const { rows: props, fields } = await fastify.epDbConn.query(
        queryString,
        datas
      );
      return { error: null, data: "Records Updated successfully" };
    }

    return {
      data: properties,
      error: null,
    };
  });
};
