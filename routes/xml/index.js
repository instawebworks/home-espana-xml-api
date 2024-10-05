module.exports = async (fastify, opts) => {
  // define the about route
  fastify.get("/properties/:productid", async (request, reply) => {
    const productid = request?.params?.productid;

    if (!productid) {
      return {
        error: "No Record ID Provided",
      };
    }

    // limit 100 offset 2300
    const queryString = `SELECT * from properties where product_id =$1`;

    const { rows: props, fields } = await fastify.epDbConn.query(queryString, [
      productid,
    ]);

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
    xml_str = xml_str.replaceAll("\n", "");

    // console.log(xml_str);
    // xml_str = xml_str.replaceAll("<", "&lt");
    // xml_str = xml_str.replaceAll(">", "&gt");

    reply.type("application/xml").send(xml_str);
  });
  fastify.get("/properties", async (request, reply) => {
    var trancate_date = new Date();
    trancate_date.setDate(trancate_date.getDate() - 10);
    // limit 100 offset 2300
    const skip_product_ids = [
      "BVCA.H419",
      "BVMT.H496",
      "BVCA.H416",
      "BVMT.H747",
    ];
    const queryString = `SELECT count(*) from properties where (status = 'Live' or status = 'live' or status_update_date > '${trancate_date.getFullYear()}/${trancate_date.getMonth()}/${trancate_date.getDate()}') and product_id not in ('${skip_product_ids.join(
      "','"
    )}') `;

    const { rows: totalCount, fields } = await fastify.epDbConn.query(
      queryString
    );
    const rowCount = totalCount?.[0]?.count || 0;
    const allPromise = [];
    const perPage = 50;
    for (let i = 1; i < rowCount; i += perPage) {
      const queryString = `SELECT xml_data from properties where (status = 'Live' or status = 'live' or status_update_date > '${trancate_date.getFullYear()}/${trancate_date.getMonth()}/${trancate_date.getDate()}') and product_id not in ('${skip_product_ids.join(
        "','"
      )}')  limit ${perPage} offset ${i - 1}`;
      allPromise.push(fastify.epDbConn.query(queryString));
    }
    const allData = await Promise.all(allPromise).then((data) => {
      return data;
    });
    let xml_str =
      "<?xml version='1.0' encoding='utf-8' standalone='yes'?><root><kyero><feed_version>3</feed_version>";

    allData.forEach((indvData) => {
      indvData?.rows?.forEach((prop) => {
        xml_str += prop?.xml_data || "";
      });
    });

    xml_str += "</kyero></root>";

    xml_str = xml_str.replaceAll("&", "&amp;");

    xml_str = xml_str.replaceAll('"', "&quot;");
    xml_str = xml_str.replaceAll(",", "&apos;");
    // xml_str = xml_str.replaceAll("\n", "<br />");
    // xml_str = xml_str.replaceAll("\n\r", "");
    // xml_str = xml_str.replaceAll("\r\n", "");
    xml_str = xml_str.replaceAll("\n", "");

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
          Product_Id: product_id,
          Crm_JSON: crm_json,
          xml_data,
        } = property;
        insert_properties.push(
          `($${++count},$${++count},$${++count},$${++count},$${++count},$${++count})`
        );
        datas.push(crm_record_id);
        datas.push(status);
        datas.push(product_id + "");
        datas.push(modified_time);
        datas.push(crm_json);
        datas.push(xml_data);
      }

      const queryString = `INSERT INTO properties (crm_record_id, status, product_id, modified_time, crm_json, xml_data ) values ${insert_properties.join(
        ","
      )} ON CONFLICT (crm_record_id) DO UPDATE SET xml_data = excluded.xml_data, status = excluded.status, product_id = excluded.product_id, crm_json = excluded.crm_json `;

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
