const convert = require("xml-js");
const xmlProperties = require("./xmlproperties.json");
const crmJSON = require("./crmjson.json");
const fs = require("fs");

let propertyFieldMapping = {
  id: "PID_Old",
  ref: "Internal_Reference",
  price: "Price",
  new_build: "New_Build_Resale",
  type: "Type_of_Property",
  town: "Area",
  province: "Province",
  beds: "Bedrooms",
  baths: "Bathrooms",
  pool: "Swimming_Pool",
  "surface_area.built": "Size_Build_m2",
  "surface_area.plot": "Size_Land_m2",
  "energy_rating.consumption": "Consumptions",
  "energy_rating.emissions": "Emissions",
  "url.en": "Link",
  video_url: "Youtube_Video_Code",
  "Communal Pool": "Swimming_Pool",
  "Private Pool": "Swimming_Pool",
  "Communal Garden": "Garden",
  "Private Garden": "Garden",
  "Off Road Parking": "Parking",
  "Secure Parking": "Parking",
  "Garage parking": "Parking",
  Furnished: "Furnished",
  "Partially Furnished": "Furnished",
  "Fitted Kitchen": "Fitted_kitchen",
  "Double Glazing": "Double_glazing",
  "Views of pool": "Views_of_Pool",
  Alarm: "Alarm",
  "Sea View": "Sea_view",
  "Outdoor Kitchen": "Summer_kitchen",
  "Separate Accomodation": "Separate_Accomodation",
  "Open Sea Views": "Property_View",
  "Valley Views": "Property_View",
  "Country Views": "Property_View",
  Heating: "Heating",
  "Open Fire": "Open_Fire",
  "Air Conditioning": "Air_Con",
  Lift: "Lift",
  Underbuild: "Underbuild",
  Solarium: "Solarium",
  "Gated Development": "Gated_Development",
  "Disabled acess": "Disabled_acess",
  "images.image": "Photos",
};

let propertyFeatures = [
  "Furnished",
  "Partially Furnished",
  "Fitted kitchen",
  "Double Glazing",
  "Views of pool",
  "Alarm",
  "Sea views",
  "Outdoor Kitchen",
  "Separate Accomodation",
  "Internet connection",
  "Heating",
  "Open Fire",
  "Air Conditioned",
  "Lift",
  "Underbuild",
  "Solarium",
  "Gated Development",
  "Disabled acess",
];

let currentSituationsOfProperty = ["new_build", "desc", "features", "images"];

let serviceMap = {
  "Communal Pool": "Comunnal",
  "Private Pool": "Private",
  "Communal Garden": "Comunnal", //Garden
  "Private Garden": "Private",
  "Off Road Parking": "Off Road", //Parking
  "Secure Parking": "Secure",
  "Garage parking": "Garage",
  "Open Sea Views": "Open Sea", //Property View
  "Valley Views": "Valley",
  "Country Views": "Country",
};

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

  // Incoming Feed
  fastify.get("/syncproperties", async (request, reply) => {
    // get compact xml data

    const accessTokenResp = await fastify.axios(process.env.ACCESS_TOKEN_URL);
    const accessToken = accessTokenResp?.data?.accessToken || "";
    if (accessToken == "") {
      return {
        data: null,
        error:
          "Issue in getting Access Token, please contact with Administrator",
      };
    }

    const url =
      "https://admin.homeespana.co.uk/admin.new/feeds/export.asp?key=idPodRiuaZK";

    const response = await fetch(url);
    const xmlResponse = await response.text();

    var convertToJSON = convert.xml2json(xmlResponse, {
      compact: true,
      spaces: 2,
    });
    const xmlProperties = JSON.parse(convertToJSON).root.property;
    let propIds = [];
    xmlProperties.forEach((indv) => {
      propIds.push(indv?.ref?._text);
    });

    const rowCount = propIds.length;

    const allPromise = [];
    const perPage = 50;
    for (let i = 1; i < rowCount; i += perPage) {
      // console.log(i, "'" + propIds.slice(i - 1, i + 50).join("','") + "'");
      const queryString = `SELECT crm_record_id, crm_json, product_id from properties where  crm_json is not null and product_id in ('${propIds
        .slice(i - 1, i + 50)
        .join("','")}')`;
      allPromise.push(fastify.epDbConn.query(queryString));
    }
    const allData = await Promise.all(allPromise).then((data) => {
      return data;
    });
    let crmJSON = {};
    allData.forEach((indvData) => {
      indvData?.rows?.forEach((prop) => {
        crmJSON[prop.product_id] = prop.crm_json;
      });
    });

    let updatedCRMData = [];
    let returnData = [];

    for (const xmlJSON of xmlProperties) {
      // xmlProperties.forEach(async (xmlJSON) => {
      const property = {};
      const referenceKey = xmlJSON.ref._text;
      // console.log({ referenceKey, xmlJSON });
      // if (!crmJSON[referenceKey]) return;
      Object.keys(xmlJSON).forEach((parent) => {
        // console.log({parent})
        if (
          typeof xmlJSON[parent] === "object" &&
          !currentSituationsOfProperty.includes(parent)
        ) {
          const children = Object.keys(xmlJSON[parent]);
          children.forEach((child) => {
            if (child !== "_text") {
              // console.log(`${parent}.${child}`);
              property[`${parent}.${child}`] = `${parent}.${child}`;
            } else {
              property[parent] = parent;
              // console.log(parent);
            }
          });
        }
      });
      const updatedCRMJSON = {};

      // handle keys except new_build,desc,features,images
      Object.keys(property).forEach((key) => {
        const keys = key.split(".");
        // console.log({keys})
        let valueFromXML = xmlJSON[keys[0]];

        // console.log({ valueFromXML, keys });
        keys.slice(1).forEach((itm) => {
          valueFromXML = valueFromXML[itm];
          // console.log({ new: valueFromXML });
        });
        const crmApiKey = propertyFieldMapping[key];

        if (!crmApiKey) return;

        try {
          if (valueFromXML._text == crmJSON[referenceKey][crmApiKey]) {
            return;
          }
        } catch (err) {
          // console.log(crmApiKey, crmJSON[referenceKey][crmApiKey], err.message);
        }
        updatedCRMJSON[crmApiKey] = valueFromXML?._text || valueFromXML;
      });

      //handle images
      const imagesFromCRM = crmJSON?.[referenceKey]?.["Photos"]
        ?.split("\n")
        ?.map((pic) => pic.split("-")[1].trim());
      const imagesFromXML = [xmlJSON["images"]?.["image"] || []]
        .flat()
        .map((img) => img.url._text);

      let crmImageList = [];

      let xmlImageList = [];

      imagesFromCRM?.forEach((imgUrl) => {
        crmImageList.push(imgUrl);
      });

      imagesFromXML?.forEach((imgUrl) => {
        xmlImageList.push(imgUrl);
      });

      crmImageList = crmImageList.sort((a, b) => a.localeCompare(b));
      xmlImageList = xmlImageList.sort((a, b) => a.localeCompare(b));

      if (JSON.stringify(crmImageList) == JSON.stringify(xmlImageList)) {
      } else {
        let updatedImageList = xmlImageList
          .map(
            (img, index) =>
              `${index + 1} - ${img}${
                index !== xmlImageList.length - 1 ? "\n" : ""
              }`
          )
          .join("");

        updatedCRMJSON[propertyFieldMapping["images.image"]] = updatedImageList;
      }

      //convert feature to array
      const feature = [xmlJSON["features"]["feature"] || []].flat();

      //handle fatures
      feature?.forEach((itm) => {
        const crmApiKey = propertyFieldMapping?.[itm?._text];

        // Fitted Kitchen
        if (!crmApiKey) return;
        const valueFromCRM = crmJSON?.[referenceKey]?.[crmApiKey];

        let value;

        if (propertyFeatures.includes(itm?._text)) {
          value = "YES";
        } else {
          value = "NO";
        }

        value = serviceMap?.[itm?._text] || value;

        if (valueFromCRM == value) return;
        updatedCRMJSON[crmApiKey] = value;
      });
      if (Object.keys(updatedCRMJSON).length > 0) {
        // updatedCRMJSON.id = crmJSON?.[referenceKey]?.["id"];
        updatedCRMData.push({
          Update_Json: JSON.stringify(updatedCRMJSON),
          Properties: crmJSON?.[referenceKey]?.["id"],
          XML_Data: convert.json2xml(xmlJSON, {
            compact: true,
            spaces: 2,
          }),
          Original_JSON: JSON.stringify(crmJSON?.[referenceKey]),
          Update_Status: "Pending",
        });
        if (updatedCRMData.length == 100) {
          try {
            const ress = await fastify.axios({
              url: "https://www.zohoapis.eu/crm/v7/Property_Update_Log",
              data: { data: updatedCRMData },
              headers: { Authorization: accessToken },
              method: "POST",
            });
            returnData.push(ress?.data?.data);
          } catch (error) {
            console.log({ error });
          }
          updatedCRMData = [];
        }
      }
    }
    if (updatedCRMData.length > 0) {
      try {
        const ress = await fastify.axios({
          url: "https://www.zohoapis.eu/crm/v7/Property_Update_Log",
          data: { data: updatedCRMData },
          headers: { Authorization: accessToken },
          method: "POST",
        });
        returnData.push(ress?.data?.data);
      } catch (error) {
        console.log({ error });
      }
    }

    return returnData;
  });

  // fastify.get("/syncproperties2", async (request, reply) => {
  //   var trancate_date = new Date();
  //   trancate_date.setDate(trancate_date.getDate() - 10);
  //   // limit 100 offset 2300

  //   const queryString = `SELECT count(*) from properties where crm_json is not null`;

  //   const { rows: totalCount, fields } = await fastify.epDbConn.query(
  //     queryString
  //   );
  //   const rowCount = totalCount?.[0]?.count || 0;

  //   const allPromise = [];
  //   const perPage = 50;
  //   for (let i = 1; i < rowCount; i += perPage) {
  //     const queryString = `SELECT crm_record_id, crm_json, product_id from properties where crm_json is not null  limit ${perPage} offset ${
  //       i - 1
  //     }`;
  //     allPromise.push(fastify.epDbConn.query(queryString));
  //   }
  //   const allData = await Promise.all(allPromise).then((data) => {
  //     return data;
  //   });
  //   let crmJSON = {};
  //   allData.forEach((indvData) => {
  //     indvData?.rows?.forEach((prop) => {
  //       crmJSON[prop.product_id] = prop.crm_json;
  //     });
  //   });

  //   // return { [Object.keys(crmJSON)[0]]: Object.values(crmJSON)[0] };
  //   // get compact xml data
  //   const url =
  //     "https://homeespananewbuild.com/wp-load.php?security_key=03640df25fbe2b01&export_id=7&action=get_data";

  //   const response = await fetch(url);
  //   const xmlResponse = await response.text();

  //   var convertToJSON = convert.xml2json(xmlResponse, {
  //     compact: true,
  //     spaces: 2,
  //   });
  //   const xmlProperties = JSON.parse(convertToJSON).root.property;

  //   const updatedCRMData = [];

  //   xmlProperties.forEach((xmlJSON) => {
  //     const property = {};
  //     const referenceKey = xmlJSON.ref._text;
  //     // console.log({ referenceKey, xmlJSON });
  //     // if (!crmJSON[referenceKey]) return;
  //     Object.keys(xmlJSON).forEach((parent) => {
  //       // console.log({parent})
  //       if (
  //         typeof xmlJSON[parent] === "object" &&
  //         parent !== "new_build" &&
  //         parent !== "desc" &&
  //         parent !== "features" &&
  //         parent !== "images"
  //       ) {
  //         const children = Object.keys(xmlJSON[parent]);
  //         children.forEach((child) => {
  //           if (child !== "_text") {
  //             // console.log(`${parent}.${child}`);
  //             property[`${parent}.${child}`] = `${parent}.${child}`;
  //           } else {
  //             property[parent] = parent;
  //             // console.log(parent);
  //           }
  //         });
  //       }
  //     });

  //     const updatedCRMJSON = {};

  //     // handle keys except new_build,desc,features,images
  //     Object.keys(property).forEach((key) => {
  //       const keys = key.split(".");
  //       // console.log({keys})
  //       let valueFromXML = xmlJSON[keys[0]];

  //       keys.slice(1).forEach((itm) => {
  //         valueFromXML = valueFromXML[itm];
  //       });
  //       const crmApiKey = propertyFieldMapping[key];

  //       if (!crmApiKey) return;

  //       // try {
  //       //   if (valueFromXML._text == crmJSON?.[referenceKey]?.[crmApiKey]) {
  //       //     return;
  //       //   }
  //       // } catch (err) {
  //       //   console.log(
  //       //     "ERROR",
  //       //     crmApiKey,
  //       //     crmJSON?.[referenceKey]?.[crmApiKey],
  //       //     err.message
  //       //   );
  //       // }

  //       updatedCRMJSON[crmApiKey] = valueFromXML._text || valueFromXML;
  //     });

  //     //handle images
  //     const imageBucket = {};
  //     const imagesFromCRM = crmJSON?.[referenceKey]?.["Photos"]
  //       ?.split("\n")
  //       ?.map((pic) => pic.split("-")[1].trim());
  //     const imagesFromXML = [xmlJSON["images"]?.["image"] || []]
  //       .flat()
  //       .map((img) => img.url._text);

  //     imagesFromCRM?.forEach((imgUrl) => (imageBucket[imgUrl] = imgUrl));
  //     imagesFromXML?.forEach((imgUrl) => (imageBucket[imgUrl] = imgUrl));

  //     let updatedImageList = Object.keys(imageBucket)
  //       .map(
  //         (img, index) =>
  //           `${index + 1} - ${img}${
  //             index !== Object.keys(imageBucket).length - 1 ? "\n" : ""
  //           }`
  //       )
  //       .join("");

  //     updatedCRMJSON[propertyFieldMapping["images.image"]] = updatedImageList;
  //     //convert feature to array
  //     const feature = [xmlJSON["features"]["feature"] || []].flat();
  //     // console.log("typeof features", [xmlJSON["features"]["feature"]].flat());

  //     //handle fatures

  //     feature?.forEach((itm) => {
  //       // console.log(itm._text,propertyFieldMapping[itm._text])

  //       const crmApiKey = propertyFieldMapping[itm._text];

  //       // Fitted Kitchen
  //       if (!crmApiKey) return;
  //       const valueFromCRM = crmJSON[referenceKey]?.[crmApiKey];
  //       let value;

  //       //Views of Pool
  //       if (
  //         itm._text === "Furnished" ||
  //         itm._text === "Partially Furnished" ||
  //         itm._text === "Fitted kitchen" ||
  //         itm._text === "Double Glazing" ||
  //         itm._text === "Views of pool" ||
  //         itm._text === "Alarm" ||
  //         itm._text === "Sea views" ||
  //         itm._text === "Outdoor Kitchen" ||
  //         itm._text === "Separate Accomodation" ||
  //         itm._text === "Internet connection" ||
  //         itm._text === "Heating" ||
  //         itm._text === "Open Fire" ||
  //         itm._text === "Air Conditioned" ||
  //         itm._text === "Lift" ||
  //         itm._text === "Underbuild" ||
  //         itm._text === "Solarium" ||
  //         itm._text === "Gated Development" ||
  //         itm._text === "Disabled acess"
  //       ) {
  //         value = "YES";
  //       } else {
  //         value = "NO";
  //       }

  //       //Swimming Pool
  //       if (itm._text === "Communal Pool") {
  //         value = "Comunnal";
  //       }
  //       if (itm._text === "Private Pool") {
  //         value = "Private";
  //       }

  //       //Garden
  //       if (itm._text === "Communal Garden") {
  //         value = "Comunnal";
  //       }
  //       if (itm._text === "Private Garden") {
  //         value = "Private";
  //       }

  //       //Parking
  //       if (itm._text === "Off Road Parking") {
  //         value = "Off Road";
  //       }
  //       if (itm._text === "Secure Parking") {
  //         value = "Secure";
  //       }
  //       if (itm._text === "Garage parking") {
  //         value = "Garage";
  //       }

  //       //Property View

  //       if (itm._text === "Open Sea Views") {
  //         value = "Open Sea";
  //       }
  //       if (itm._text === "Valley Views") {
  //         value = "Valley";
  //       }
  //       if (itm._text === "Country Views") {
  //         value = "Country";
  //       }

  //       if (valueFromCRM == value) return;

  //       // console.log({crmApiKey,value})
  //       updatedCRMJSON[crmApiKey] = value;

  //       // console.log({ crmApiKey, value });
  //     });
  //     updatedCRMData.push(updatedCRMJSON);
  //     // console.log({ updatedCRMJSON });
  //     // console.log({ property });
  //   });
  //   // console.log({ updatedCRMData });
  //   return updatedCRMData;
  //   reply.type("application/xml").send(xml_str);
  // });
};
