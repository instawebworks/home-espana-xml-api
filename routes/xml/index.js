const convert = require("xml-js");
// const xmlProperties = require("./xmlproperties.json");
// const crmJSON = require("./crmjson.json");
const fs = require("fs");
const test = false;
let propertyFieldMapping = {
  id: "PID_Old",
  ref: "Internal_Reference",
  price: "Price",
  new_build: "New_Build_Resale",
  "type.0": "Type_of_Property",
  type: "Type_of_Property",
  development: "Site_Public_Name",
  town: "Area",
  province: "Region", // Instead of Province
  beds: "Bedrooms",
  baths: "Bathrooms",
  pool: "Swimming_Pool",
  "location.latitude": "Lat",
  "location.longitude": "Lng",
  parking: "Parking",
  "beds._cdata": "Bedrooms",
  "baths._cdata": "Bathrooms",
  terrace: "Terraces",
  "Air Conditioning": "Air_Con",
  "Fitted Kitchen": "Fitted_kitchen",
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
  "Secured Parking": "Parking",
  "Garage Parking": "Parking",
  "Garage parking": "Parking",
  "completion__1 - 2 Years": "Completion_old",
  "completion__More than 2 years": "Completion_2_old",
  developer: "Developer_old",
  url: "Link",
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
  desc: "Full_description",
  feed_agent: "Feed_Agent",
};
let propertyMarketingFieldMapping = {
  id: "PID_Old",
  ref: "Internal_Reference",
  price: "Price",
  new_build: "New_Build_Resale",
  "type._cdata": "Type_of_Property",
  type: "Type_of_Property",
  development: "Site_Public_Name",
  town: "Area",
  beds: "Bedrooms",
  baths: "Bathrooms",
  pool: "Swimming_Pool",
  "location.latitude": "Lat",
  "location.longitude": "Lng",
  parking: "Parking",
  "beds._cdata": "Bedrooms",
  "baths._cdata": "Bathrooms",
  terrace: "Terraces",
  "air conditioner": "Air_Con",
  "air conditioning": "Air_Con",
  "surface_area.built": "Size_Build_m2",
  "surface_area.plot": "Size_Land_m2",
  "energy_rating.consumption": "Consumptions",
  "energy_rating.emissions": "Emissions",
  "url.en": "Link",
  video_url: "Youtube_Video_Code",
  "communal pool": "Swimming_Pool",
  "private pool": "Swimming_Pool",
  "community garden": "Garden",
  "communal garden": "Garden",
  "private garden": "Garden",
  "off road parking": "Parking",
  "parking off-road": "Parking",
  "secured parking": "Parking",
  "garage parking": "Parking",
  "parking garage": "Parking",
  "completion__1 - 2 Years": "Completion_old",
  "completion__More than 2 years": "Completion_2_old",
  developer: "Developer_old",
  url: "Link",
  furnished: "Furnished",
  "Partially Furnished": "Furnished",
  "fitted kitchen": "Fitted_kitchen",
  "double glazing": "Double_glazing",
  "views of pool": "Views_of_Pool",
  alarm: "Alarm",
  "sea view": "Sea_view",
  "sea views": "Sea_view",
  "outdoor kitchen": "Summer_kitchen",
  "separate zccomodation": "Separate_Accomodation",
  "open sea views": "Property_View",
  "valley views": "Property_View",
  "country views": "Property_View",
  heating: "Heating",
  "central heating": "Heating",
  "open fire": "Open_Fire",
  "air conditioning": "Air_Con",
  "a/c": "Air_Con",
  lift: "Lift",
  underbuild: "Underbuild",
  solarium: "Solarium",
  "gated development": "Gated_Development",
  "disabled acess": "Disabled_acess",
  "images.image": "Photos",
  desc: "Full_description",
  "desc.en": "Full_description",
  feed_agent: "Feed_Agent",
  jacuzzi: "Jacuzzi",
  storeroom: "Storage_Unit",
  "storage room": "Storage_Unit",
  fireplace: "Open_Fire",
  "broadband internet": "Broadband",
  "one-floor": "Levels_in_Property",
  "disabled access": "Disabled_access",
  "double glazing": "Double_glazing",
};

let propertyFeatures = [
  "Air Conditioning",
  "Fitted Kitchen",
  "Furnished",
  "FURNISHED",
  "furnished",
  "Partially Furnished",
  "PARTIALLY FURNISHED",
  "partially furnished",
  "Fitted kitchen",
  "FITTED KITCHEN",
  "fitted kitchen",
  "Double Glazing",
  "DOUBLE GLAZING",
  "double glazing",
  "Views of pool",
  "VIEWS OF POOL",
  "views of pool",
  "Alarm",
  "ALARM",
  "alarm",
  "Sea views",
  "SEA VIEWS",
  "sea views",
  "Sea view",
  "SEA VIEW",
  "sea view",
  "Outdoor Kitchen",
  "OUTDOOR KITCHEN",
  "outdoor kitchen",
  "Separate Accomodation",
  "SEPARATE ACCOMODATION",
  "separate accomodation",
  "Internet connection",
  "INTERNET CONNECTION",
  "internet connection",
  "Heating",
  "HEATING",
  "heating",
  "Open Fire",
  "OPEN FIRE",
  "open fire",
  "Air Conditioned",
  "AIR CONDITIONED",
  "air conditioned",
  "Air Con",
  "AIR CON",
  "air con",
  "Lift",
  "LIFT",
  "lift",
  "Underbuild",
  "UNDERBUILD",
  "underbuild",
  "Solarium",
  "SOLARIUM",
  "solarium",
  "Gated Development",
  "GATED DEVELOPMENT",
  "gated development",
  "Disabled acess",
  "DISABLED ACESS",
  "disabled acess",
  "Garage",
  "GARAGE",
  "garage",
  "Marble floors",
  "MARBLE FLOORS",
  "marble floors",
  "Summer kitchen",
  "SUMMER KITCHEN",
  "summer kitchen",
  "Electricity",
  "ELECTRICITY",
  "electricity",
  "Water Supply",
  "WATER SUPPLY",
  "water supply",
  "Telephone",
  "TELEPHONE",
  "telephone",
  "Broadband",
  "BROADBAND",
  "broadband",
  "Disabled access",
  "DISABLED ACCESS",
  "disabled access",
];

let currentSituationsOfProperty = ["features", "images"];

let serviceMap = {
  "Pool Private": "Private",
  "Private pool": "Private",
  "Pool Communal": "Communal",
  "Communal pool": "Communal",
  "Communal Pool": "Comunnal",
  "Private Pool": "Private",
  "Communal Garden": "Comunnal", //Garden
  "Community garden": "Comunnal",
  "Private Garden": "Private",
  "Off Road Parking": "Off Road", //Parking
  "Secured Parking": "Secure",
  "Parking Garage": "Garage",
  "Off road parking": "Off Road",
  "Garage parking": "Garage",
  "Garage Parking": "Garage",
  "Open Sea Views": "Open Sea", //Property View
  "Valley Views": "Valley",
  "Country Views": "Country",
  "Parking Garage": "Garage",
  "One-floor": "Property on 1 level",
};

let propertyMarketingFeatures = [
  "double glazing",
  "disabled access",
  "broadband internet",
  "fireplace",
  "storeroom",
  "storage room",
  "jacuzzi",
  "air conditioner",
  "air conditioning",
  "a/c",
  "fitted kitchen",
  "furnished",
  "partially furnished",
  "double glazing",
  "views of pool",
  "alarm",

  "sea views",
  "sea view",
  "outdoor kitchen",
  "separate accomodation",
  "internet connection",
  "heating",
  "open fire",
  "air conditioned",
  "air con",
  "lift",
  "underbuild",
  "solarium",
  "gated development",
  "disabled acess",
  "garage",
  "marble floors",
  "summer kitchen",
  "electricity",
  "water supply",
  "telephone",
  "broadband",
  "disabled access",
  "central heating",
];

let serviceMapForPropertyMarketing = {
  "pool private": "Private",
  "private pool": "Private",
  "pool communal": "Communal",
  "communal pool": "Communal",
  "communal garden": "Comunnal", //Garden
  "community garden": "Comunnal",
  "private garden": "Private",
  "secured parking": "Secure",
  "parking garage": "Garage",
  "off road parking": "Off Road",
  "parking off-road": "Off Road",
  "garage parking": "Garage",
  "open sea views": "Open Sea", //Property View
  "valley views": "Valley",
  "country views": "Country",
  "parking garage": "Garage",
  "one-floor": "Property on 1 level",
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
    // xml_str = xml_str.replaceAll("'", "&apos;");
    // xml_str = xml_str.replaceAll("\n", "<br />");
    // xml_str = xml_str.replaceAll("\n\r", "");
    // xml_str = xml_str.replaceAll("\r\n", "");
    // xml_str = xml_str.replaceAll("\n", "");

    // console.log(xml_str);
    // xml_str = xml_str.replaceAll("<", "&lt");
    // xml_str = xml_str.replaceAll(">", "&gt");

    reply.type("application/xml").send(xml_str);
  });

  fastify.get("/cacheproperties", async (request, reply) => {
    var trancate_date = new Date();
    trancate_date.setDate(trancate_date.getDate() - 10);
    // limit 100 offset 2300
    const skip_product_ids = [
      "BVCA.H419",
      "BVMT.H496",
      "BVCA.H416",
      "BVMT.H747",
    ];
    const queryString = `SELECT count(*) from properties where (status = 'Live' or status = 'live' or status = 'SOLD BY HOMEESPANA' or status_update_date > '${trancate_date.getFullYear()}/${trancate_date.getMonth()}/${trancate_date.getDate()}') and product_id not in ('${skip_product_ids.join(
      "','"
    )}') `;

    const { rows: totalCount, fields } = await fastify.epDbConn.query(
      queryString
    );
    const rowCount = totalCount?.[0]?.count || 0;
    const allPromise = [];
    const perPage = 50;
    for (let i = 1; i < rowCount; i += perPage) {
      const queryString = `SELECT xml_data from properties where (status = 'Live' or status = 'live' or status = 'SOLD BY HOMEESPANA' or status_update_date > '${trancate_date.getFullYear()}/${trancate_date.getMonth()}/${trancate_date.getDate()}') and product_id not in ('${skip_product_ids.join(
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
    // xml_str = xml_str.replaceAll("'", "&apos;");
    // xml_str = xml_str.replaceAll("\n", "<br />");
    // xml_str = xml_str.replaceAll("\n\r", "");
    // xml_str = xml_str.replaceAll("\r\n", "");
    // xml_str = xml_str.replaceAll("\n", "");

    // console.log(xml_str);
    // xml_str = xml_str.replaceAll("<", "&lt");
    // xml_str = xml_str.replaceAll(">", "&gt");

    const resp = await fastify.cacheConn.set(
      `sync_properties`,
      xml_str,
      "EX",
      600000
    );
    return resp;
  });

  fastify.get("/properties", async (request, reply) => {
    // const cachedXML = await fastify.cacheConn.get("sync_properties");
    // if (cachedXML) {
    //   reply.type("application/xml").send(cachedXML);
    //   return;
    // }

    var trancate_date = new Date();
    trancate_date.setDate(trancate_date.getDate() - 10);
    // limit 100 offset 2300

    const skip_product_ids = [
      "BVCA.H419",
      "BVMT.H496",
      "BVCA.H416",
      "BVMT.H747",
    ];
    const queryString = `SELECT count(*) from properties where (status = 'Live' or status = 'live' or status = 'SOLD BY HOMEESPANA' or status = 'Sold By HomeEspana') and product_id not in ('${skip_product_ids.join(
      "','"
    )}') `;

    const { rows: totalCount, fields } = await fastify.epDbConn.query(
      queryString
    );

    const rowCount = totalCount?.[0]?.count || 0;
    console.log({ rowCount });
    const allPromise = [];
    const perPage = 50;
    for (let i = 1; i < rowCount; i += perPage) {
      const queryString = `SELECT xml_data from properties where (status = 'Live' or status = 'live' or status = 'SOLD BY HOMEESPANA' or status = 'Sold By HomeEspana') and product_id not in ('${skip_product_ids.join(
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
    // xml_str = xml_str.replaceAll("'", "&apos;");
    // xml_str = xml_str.replaceAll("\n", "<br />");
    // xml_str = xml_str.replaceAll("\n\r", "");
    // xml_str = xml_str.replaceAll("\r\n", "");
    // xml_str = xml_str.replaceAll("\n", "");

    // console.log(xml_str);
    // xml_str = xml_str.replaceAll("<", "&lt");
    // xml_str = xml_str.replaceAll(">", "&gt");

    reply.type("application/xml").send(xml_str);
  });

  fastify.get("/ncb/properties", async (request, reply) => {
    // const cachedXML = await fastify.cacheConn.get("sync_properties");
    // if (cachedXML) {
    //   reply.type("application/xml").send(cachedXML);
    //   return;
    // }

    var trancate_date = new Date();
    trancate_date.setDate(trancate_date.getDate() - 10);
    // limit 100 offset 2300

    const skip_product_ids = [
      "BVCA.H419",
      "BVMT.H496",
      "BVCA.H416",
      "BVMT.H747",
    ];
    const queryString = `SELECT count(*) from properties where (status = 'Live' or status = 'live' or status = 'SOLD BY HOMEESPANA'  or status = 'Sold By HomeEspana') and product_id like 'NCB%' and product_id not like 'NCBKP%' and product_id not in ('${skip_product_ids.join(
      "','"
    )}') `;

    // const queryString = `SELECT count(*) from properties where (status = 'Live' or status = 'live' or status = 'SOLD BY HOMEESPANA' or status_update_date > '${trancate_date.getFullYear()}/${trancate_date.getMonth()}/${trancate_date.getDate()}') and (product_id like 'NCB%' or region = 'COSTA BLANCA NORTH') and product_id not in ('${skip_product_ids.join(
    //   "','"
    // )}') `;

    const { rows: totalCount, fields } = await fastify.epDbConn.query(
      queryString
    );
    const rowCount = totalCount?.[0]?.count || 0;
    console.log({ rowCount });
    const allPromise = [];
    const perPage = 50;
    for (let i = 1; i < rowCount; i += perPage) {
      const queryString = `SELECT xml_data from properties where (status = 'Live' or status = 'live' or status = 'SOLD BY HOMEESPANA'  or status = 'Sold By HomeEspana') and product_id like 'NCB%' and product_id not like 'NCBKP%' and product_id not in ('${skip_product_ids.join(
        "','"
      )}')  limit ${perPage} offset ${i - 1}`;
      allPromise.push(fastify.epDbConn.query(queryString));
    }
    console.log({ allPromise });
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
    // xml_str = xml_str.replaceAll("'", "&apos;");
    // xml_str = xml_str.replaceAll("\n", "<br />");
    // xml_str = xml_str.replaceAll("\n\r", "");
    // xml_str = xml_str.replaceAll("\r\n", "");
    // xml_str = xml_str.replaceAll("\n", "");

    // console.log(xml_str);
    // xml_str = xml_str.replaceAll("<", "&lt");
    // xml_str = xml_str.replaceAll(">", "&gt");

    reply.type("application/xml").send(xml_str);
  });
  fastify.get("/vlc/properties", async (request, reply) => {
    // const cachedXML = await fastify.cacheConn.get("sync_properties");
    // if (cachedXML) {
    //   reply.type("application/xml").send(cachedXML);
    //   return;
    // }

    var trancate_date = new Date();
    trancate_date.setDate(trancate_date.getDate() - 10);
    // limit 100 offset 2300

    const skip_product_ids = [
      "BVCA.H419",
      "BVMT.H496",
      "BVCA.H416",
      "BVMT.H747",
    ];
    const queryString = `SELECT count(*) from properties where (status = 'Live' or status = 'live' or status = 'SOLD BY HOMEESPANA' or status = 'Sold By HomeEspana') and product_id like 'VLC%' and product_id not like 'VLCKP%' and product_id not in ('${skip_product_ids.join(
      "','"
    )}') `;
    console.log(queryString);
    // const queryString = `SELECT count(*) from properties where (status = 'Live' or status = 'live' or status = 'SOLD BY HOMEESPANA' or status_update_date > '${trancate_date.getFullYear()}/${trancate_date.getMonth()}/${trancate_date.getDate()}') and (product_id like 'VLC%' or region = 'Valencia'or region = 'Castellon') and product_id not in ('${skip_product_ids.join(
    //   "','"
    // )}') `;

    const { rows: totalCount, fields } = await fastify.epDbConn.query(
      queryString
    );

    const rowCount = totalCount?.[0]?.count || 0;
    console.log({ rowCount });
    const allPromise = [];
    const perPage = 50;
    for (let i = 1; i < rowCount; i += perPage) {
      const queryString = `SELECT xml_data from properties where (status = 'Live' or status = 'live' or status = 'SOLD BY HOMEESPANA' or status = 'Sold By HomeEspana' ) and product_id like 'VLC%' and product_id not like 'VLCKP%' and product_id not in ('${skip_product_ids.join(
        "','"
      )}')  limit ${perPage} offset ${i - 1}`;

      allPromise.push(fastify.epDbConn.query(queryString));
    }
    console.log({ allPromise });
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
    // xml_str = xml_str.replaceAll("'", "&apos;");
    // xml_str = xml_str.replaceAll("\n", "<br />");
    // xml_str = xml_str.replaceAll("\n\r", "");
    // xml_str = xml_str.replaceAll("\r\n", "");
    // xml_str = xml_str.replaceAll("\n", "");

    // console.log(xml_str);
    // xml_str = xml_str.replaceAll("<", "&lt");
    // xml_str = xml_str.replaceAll(">", "&gt");

    reply.type("application/xml").send(xml_str);
  });
  fastify.get("/hemh/properties", async (request, reply) => {
    // const cachedXML = await fastify.cacheConn.get("sync_properties");
    // if (cachedXML) {
    //   reply.type("application/xml").send(cachedXML);
    //   return;
    // }

    var trancate_date = new Date();
    trancate_date.setDate(trancate_date.getDate() - 10);
    // limit 100 offset 2300

    const skip_product_ids = [
      "BVCA.H419",
      "BVMT.H496",
      "BVCA.H416",
      "BVMT.H747",
    ];
    const queryString = `SELECT count(*) from properties where (status = 'Live' or status = 'live' or status = 'SOLD BY HOMEESPANA'  or status = 'Sold By HomeEspana' ) and (product_id like 'HE%' or product_id like 'MH%') and product_id not like 'HEKP%' and product_id not like 'MHKP%' and product_id not in ('${skip_product_ids.join(
      "','"
    )}') `;
    console.log({ queryString });

    // const queryString = `SELECT count(*) from properties where (status = 'Live' or status = 'live' or status = 'SOLD BY HOMEESPANA' or status_update_date > '${trancate_date.getFullYear()}/${trancate_date.getMonth()}/${trancate_date.getDate()}') and (product_id like 'HE%' or product_id like 'MH%' or region = 'COSTA BLANCA SOUTH'or region = 'Almeria' or region like 'Murcia%') and product_id not in ('${skip_product_ids.join(
    //   "','"
    // )}') `;

    const { rows: totalCount, fields } = await fastify.epDbConn.query(
      queryString
    );
    const rowCount = totalCount?.[0]?.count || 0;
    console.log({ rowCount });
    const allPromise = [];
    const perPage = 50;
    for (let i = 1; i < rowCount; i += perPage) {
      const queryString = `SELECT xml_data from properties where (status = 'Live' or status = 'live' or status = 'SOLD BY HOMEESPANA'  or status = 'Sold By HomeEspana') and (product_id like 'HE%' or product_id like 'MH%') and product_id not like 'HEKP%' and product_id not like 'MHKP%' and product_id not in ('${skip_product_ids.join(
        "','"
      )}')  limit ${perPage} offset ${i - 1}`;
      allPromise.push(fastify.epDbConn.query(queryString));
    }
    console.log({ allPromise });
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
    // xml_str = xml_str.replaceAll("'", "&apos;");
    // xml_str = xml_str.replaceAll("\n", "<br />");
    // xml_str = xml_str.replaceAll("\n\r", "");
    // xml_str = xml_str.replaceAll("\r\n", "");
    // xml_str = xml_str.replaceAll("\n", "");

    // console.log(xml_str);
    // xml_str = xml_str.replaceAll("<", "&lt");
    // xml_str = xml_str.replaceAll(">", "&gt");

    reply.type("application/xml").send(xml_str);
  });
  fastify.get("/k/properties", async (request, reply) => {
    // const cachedXML = await fastify.cacheConn.get("sync_properties");
    // if (cachedXML) {
    //   reply.type("application/xml").send(cachedXML);
    //   return;
    // }

    var trancate_date = new Date();
    trancate_date.setDate(trancate_date.getDate() - 10);
    // limit 100 offset 2300

    const skip_product_ids = [
      "BVCA.H419",
      "BVMT.H496",
      "BVCA.H416",
      "BVMT.H747",
    ];
    const queryString = `SELECT count(*) from properties where (status = 'Live' or status = 'live' or status = 'SOLD BY HOMEESPANA' or status_update_date > '${trancate_date.getFullYear()}/${trancate_date.getMonth()}/${trancate_date.getDate()}') and product_id like '%K%' and product_id not in ('${skip_product_ids.join(
      "','"
    )}') `;

    const { rows: totalCount, fields } = await fastify.epDbConn.query(
      queryString
    );
    const rowCount = totalCount?.[0]?.count || 0;
    console.log({ rowCount });
    const allPromise = [];
    const perPage = 50;
    for (let i = 1; i < rowCount; i += perPage) {
      const queryString = `SELECT xml_data from properties where (status = 'Live' or status = 'live' or status = 'SOLD BY HOMEESPANA' or status_update_date > '${trancate_date.getFullYear()}/${trancate_date.getMonth()}/${trancate_date.getDate()}') and product_id like '%K%' and product_id not in ('${skip_product_ids.join(
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
    // xml_str = xml_str.replaceAll("'", "&apos;");
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
          region,
        } = property;
        insert_properties.push(
          `($${++count},$${++count},$${++count},$${++count},$${++count},$${++count},$${++count})`
        );
        datas.push(crm_record_id);
        datas.push(status);
        datas.push(product_id + "");
        datas.push(modified_time);
        datas.push(crm_json);
        datas.push(xml_data);
        datas.push(region);
      }

      const queryString = `INSERT INTO properties (crm_record_id, status, product_id, modified_time, crm_json, xml_data, region ) values ${insert_properties.join(
        ","
      )} ON CONFLICT (crm_record_id) DO UPDATE SET xml_data = excluded.xml_data, status = excluded.status, product_id = excluded.product_id, crm_json = excluded.crm_json, region=excluded.region `;
      // console.log({ queryString })
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

      // crmImageList = crmImageList.sort((a, b) => a.localeCompare(b));
      // xmlImageList = xmlImageList.sort((a, b) => a.localeCompare(b));

      // if (JSON.stringify(crmImageList) == JSON.stringify(xmlImageList)) {
      // } else {
      let updatedImageList = xmlImageList
        .map(
          (img, index) =>
            `${index + 1} - ${img}${
              index !== xmlImageList.length - 1 ? "\n" : ""
            }`
        )
        .join("");

      updatedCRMJSON[propertyFieldMapping["images.image"]] = updatedImageList;
      // }

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

        value = serviceMap?.[itm?._text.toLowerCase()] || value;

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
            // console.log({ error });
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
        // console.log({ error });
      }
    }

    return returnData;
  });
  fastify.get("/syncpropertiesnew", async (request, reply) => {
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
      "https://homeespananewbuild.com/wp-load.php?security_key=03640df25fbe2b01&export_id=7&action=get_data";

    const response = await fetch(url);
    const xmlResponse = await response.text();

    var convertToJSON = convert.xml2json(xmlResponse, {
      compact: true,
      spaces: 2,
    });
    const xmlProperties = JSON.parse(convertToJSON).root.property;

    // console.log({ xmlProperties });

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
      const property = {};
      const referenceKey = xmlJSON.ref._text;
      // console.log({ referenceKey, xmlJSON });
      // if (!crmJSON[referenceKey]) return;
      Object.keys(xmlJSON).forEach((parent) => {
        if (
          typeof xmlJSON[parent] === "object" &&
          !currentSituationsOfProperty.includes(parent)
        ) {
          const children = Object.keys(xmlJSON[parent]);
          children.forEach((child) => {
            if (child !== "_text") {
              property[`${parent}.${child}`] = `${parent}.${child}`;
            } else {
              property[parent] = parent;
            }
          });
        }
      });

      const updatedCRMJSON = {};

      // handle keys except desc,features,images
      Object.keys(property).forEach((key) => {
        const keys = key.split(".");
        // console.log({keys})
        let valueFromXML = xmlJSON[keys[0]];

        // console.log({ valueFromXML, keys });
        keys.slice(1).forEach((itm) => {
          valueFromXML = valueFromXML[itm];
          // console.log({ new: valueFromXML });
        });
        let crmApiKey = propertyFieldMapping[key];
        if (key === "baths._cdata" || key === "baths") {
          updatedCRMJSON[crmApiKey] = Number(
            (valueFromXML?._text || valueFromXML).slice(0, 1)
          );
          updatedCRMJSON["Bathroom_Options"] =
            valueFromXML?._text || valueFromXML;
          return;
        }

        if (key === "beds._cdata" || key === "beds") {
          updatedCRMJSON[crmApiKey] = Number(
            (valueFromXML?._text || valueFromXML).slice(0, 1)
          );
          updatedCRMJSON["Bedroom_Options"] =
            valueFromXML?._text || valueFromXML;
          return;
        }

        //if key is beds._cdata (for bedrooms) and the value of it is not number then we need to change the api key
        // if (
        //   (key === "beds._cdata" || key === "beds") &&
        //   !Number(valueFromXML?._text || valueFromXML)
        // ) {
        //   crmApiKey = "Bedroom_Options";
        // }
        // "completion__1 - 2 Years": "Completion_old",
        // "completion__More than 2 years": "Completion_2_old",

        // change crmApiKey based on clients requirement (if value from xml is 1 - 2 Years then api key will be Completion_old and if value is More than 2 years)
        if (
          key.split(".")[0] === "completion" &&
          valueFromXML?._text === "1 - 2 Years"
        ) {
          crmApiKey = propertyFieldMapping["completion__1 - 2 Years"];
        }
        if (
          key.split(".")[0] === "completion" &&
          valueFromXML?._text === "More than 2 years"
        ) {
          crmApiKey = propertyFieldMapping["completion__More than 2 years"];
        }
        // console.log({
        //   key,
        //   crmApiKey,
        //   valueFromXML: valueFromXML?._text || valueFromXML,
        // });
        if (!crmApiKey) return;
        // New_Build_Resale
        //handle parking based on clients requirement (if 1 then value will be Off Road)
        if (key === "parking" && valueFromXML?._text === "1") {
          updatedCRMJSON[crmApiKey] = "Off Road";
          return;
        }
        //handle new_build based on clients requirement (if 1 then value will be New Build)
        //any other value except 1 wont be included to the updatedCRMJSON
        if (key === "new_build" && valueFromXML?._text === "1") {
          updatedCRMJSON[crmApiKey] = "New Build";
          return;
        } else if (key === "new_build" && valueFromXML?._text !== "1") {
          return;
        }

        //handle type.0 (Type_of_Property) based on clients requirement (if 1 then value will be Off Road)
        if (key === "type.0" || key === "type") {
          const propertyTypes = [
            "1st Floor Apartment",
            "Apartment",
            "Bungalow",
            "Commercial",
            "Ground Floor Apartment",
            "Land",
            "Penthouse Apartment",
            "Studio Apartment",
            "Townhouse",
            "Villa",
          ];
          // check wheather xml value is found in propertyTypes if fund put it to updatedCRMJSON otherwise do nothing
          const isFound = propertyTypes.find(
            (type) => type === valueFromXML?._text
          );
          if (!isFound) {
            return;
          }
          updatedCRMJSON[crmApiKey] = valueFromXML?._text;
        }

        //if crm key is Area add '- ' before value
        if (key === "town" && crmApiKey === "Area") {
          updatedCRMJSON[crmApiKey] =
            "- " + valueFromXML?._text || valueFromXML;

          return;
        }

        try {
          if (valueFromXML._text == crmJSON[referenceKey][crmApiKey]) {
            // If Matches Return
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

      // crmImageList = crmImageList.sort((a, b) => a.localeCompare(b));
      // xmlImageList = xmlImageList.sort((a, b) => a.localeCompare(b));

      // if (JSON.stringify(crmImageList) == JSON.stringify(xmlImageList)) {
      // } else {
      let updatedImageList = xmlImageList
        .map(
          (img, index) =>
            `${index + 1} - ${img}${
              index !== xmlImageList.length - 1 ? "\n" : ""
            }`
        )
        .join("");

      updatedCRMJSON[propertyFieldMapping["images.image"]] = updatedImageList;
      // }

      //convert feature to array
      const feature = [xmlJSON["features"]["feature"] || []].flat();
      // console.log({ feature });

      //handle fatures
      feature?.forEach((itm) => {
        const crmApiKey = propertyFieldMapping?.[itm?._text];

        // Fitted Kitchen
        if (!crmApiKey) return;

        let value;

        if (propertyFeatures.includes(itm?._text)) {
          value = "YES";
        } else {
          value = "NO";
        }

        value = serviceMap?.[itm?._text] || value;
        // console.log({ crmApiKey, xmlVal: itm._text, value });
        // if (valueFromCRM == value) return;
        updatedCRMJSON[crmApiKey] = value;
      });
      // console.log({ updatedCRMJSON });

      if (Object.keys(updatedCRMJSON).length > 0) {
        updatedCRMJSON.Status = "Live";
        updatedCRMData.push({
          Update_Json: JSON.stringify(updatedCRMJSON),
          Properties: crmJSON?.[referenceKey]?.["id"],
          XML_Data:
            "<property>" +
            convert.json2xml(xmlJSON, {
              compact: true,
              spaces: 2,
            }) +
            "</property>",
          Original_JSON: JSON.stringify(crmJSON?.[referenceKey]),
          Update_Status: "Pending",
          XML_Source: "homeespananewbuild",
        });
        if (test != true) {
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
              // console.log({ error });
            }
            updatedCRMData = [];
          }
        }
      }
    }

    // console.log({ updatedCRMData });
    if (test != true) {
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
          // console.log({ error });
        }
      }
    }

    // console.log({ updatedCRMData });
    return "updatedCRMData";
  });

  fastify.get("/syncpropertyportalmarketing", async (request, reply) => {
    // get compact xml data
    const accessTokenResp = await fastify.axios(
      process.env.SANDBOX_ACCESS_TOKEN_URL
    );
    const accessToken = accessTokenResp?.data?.accessToken || "";

    if (accessToken == "") {
      return {
        data: null,
        error:
          "Issue in getting Access Token, please contact with Administrator",
      };
    }

    const url =
      "https://www.propertyportalmarketing.com/xml/homeespana-merge-5.xml";

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

    // const allPromise = [];
    // const perPage = 50;
    // for (let i = 1; i < rowCount; i += perPage) {
    //   // console.log(i, "'" + propIds.slice(i - 1, i + 50).join("','") + "'");
    //   const queryString = `SELECT crm_record_id, crm_json, product_id from properties where  crm_json is not null and product_id in ('${propIds
    //     .slice(i - 1, i + 50)
    //     .join("','")}')`;
    //   allPromise.push(fastify.epDbConn.query(queryString));
    // }
    // const allData = await Promise.all(allPromise).then((data) => {
    //   return data;
    // });
    let crmJSON = {};
    // allData.forEach((indvData) => {
    //   indvData?.rows?.forEach((prop) => {
    //     crmJSON[prop.product_id] = prop.crm_json;
    //   });
    // });

    let updatedCRMData = [];
    let returnData = [];
    const types = [];
    console.log(xmlProperties.length);

    for (const xmlJSON of xmlProperties) {
      const property = {};
      const referenceKey = xmlJSON.ref._text;

      // if (!crmJSON[referenceKey]) return;
      Object.keys(xmlJSON).forEach((parent) => {
        if (
          typeof xmlJSON[parent] === "object" &&
          !currentSituationsOfProperty.includes(parent)
        ) {
          const children = Object.keys(xmlJSON[parent]);
          // console.log({ children });
          children.forEach((child) => {
            if (child !== "_text") {
              property[`${parent}.${child}`] = `${parent}.${child}`;
            } else {
              property[parent] = parent;
            }
          });
        }
      });

      const updatedCRMJSON = {};

      // handle keys except desc,features,images
      Object.keys(property).forEach((key) => {
        const keys = key.split(".");
        let valueFromXML = xmlJSON[keys[0]];

        keys.slice(1).forEach((itm) => {
          valueFromXML = valueFromXML[itm];
          // console.log({ new: valueFromXML });
        });
        // if (key == "type._cdata") {
        //   console.log("outside", { key, valueFromXML });
        // }
        let crmApiKey = propertyMarketingFieldMapping[key.toLowerCase()];

        if (key === "energy_rating.consumption") {
          const options = {
            A: "A",
            B: "B",
            C: "C",
            D: "D",
            E: "E",
            F: "F",
            G: "G",
          };

          updatedCRMJSON[crmApiKey] =
            options[valueFromXML?._text || valueFromXML] || "Pending";

          return;
        }
        if (key === "energy_rating.emissions") {
          const options = {
            A: "A",
            B: "B",
            C: "C",
            D: "D",
            E: "E",
            F: "F",
            G: "G",
          };

          updatedCRMJSON[crmApiKey] =
            options[valueFromXML?._text || valueFromXML] || "Pending";
          return;
        }

        if (key === "baths._cdata" || key === "baths") {
          updatedCRMJSON[crmApiKey] = Number(
            (valueFromXML?._text || valueFromXML).slice(0, 1)
          );
          updatedCRMJSON["Bathroom_Options"] =
            valueFromXML?._text || valueFromXML;
          return;
        }

        if (key === "beds._cdata" || key === "beds") {
          updatedCRMJSON[crmApiKey] = Number(
            (valueFromXML?._text || valueFromXML).slice(0, 1)
          );
          updatedCRMJSON["Bedroom_Options"] =
            valueFromXML?._text || valueFromXML;
          return;
        }

        //if key is beds._cdata (for bedrooms) and the value of it is not number then we need to change the api key
        // if (
        //   (key === "beds._cdata" || key === "beds") &&
        //   !Number(valueFromXML?._text || valueFromXML)
        // ) {
        //   crmApiKey = "Bedroom_Options";
        // }
        // "completion__1 - 2 Years": "Completion_old",
        // "completion__More than 2 years": "Completion_2_old",

        // change crmApiKey based on clients requirement (if value from xml is 1 - 2 Years then api key will be Completion_old and if value is More than 2 years)
        if (
          key.split(".")[0] === "completion" &&
          valueFromXML?._text === "1 - 2 Years"
        ) {
          crmApiKey = propertyMarketingFieldMapping["completion__1 - 2 Years"];
        }
        if (
          key.split(".")[0] === "completion" &&
          valueFromXML?._text === "More than 2 years"
        ) {
          crmApiKey =
            propertyMarketingFieldMapping["completion__More than 2 years"];
        }
        // console.log({
        //   key,
        //   crmApiKey,
        //   valueFromXML: valueFromXML?._text || valueFromXML,
        // });
        if (!crmApiKey) return;
        // New_Build_Resale
        //handle parking based on clients requirement (if 1 then value will be Off Road)
        if (key === "parking" && valueFromXML?._text === "1") {
          updatedCRMJSON[crmApiKey] = "Off Road";
          return;
        }
        //
        // if (key === "new_build") {
        //   new_buiilds.push({
        //     key: "new_build",
        //     value: valueFromXML?._text || valueFromXML,
        //     xmlJSON,
        //   });
        // }
        //handle new_build based on clients requirement (if 1 then value will be New Build)
        //any other value except 1 wont be included to the updatedCRMJSON
        // if (key === "new_build" && valueFromXML?._text === "1") {
        //   updatedCRMJSON[crmApiKey] = "New Build";
        //   return;
        // } else if (key === "new_build" && valueFromXML?._text !== "1") {
        //   updatedCRMJSON[crmApiKey] = "Resale";
        //   return;
        // }

        //handle type.0 (Type_of_Property) based on clients requirement (if 1 then value will be Off Road)
        if (key === "type._cdata" || key === "type") {
          // console.log({ valueFromXML, type: xmlJSON.type });
          const map = {
            "DETACHED VILLA": "Villa",
            PLOT: "Land",
            VILLA: "Villa",
            VILLAS: "Villa",
            DUPLEX: "Apartment",
            "TOWN HOUSE": "Townhouse",
            TOWNHOUSE: "Townhouse",
            "COMMERCIAL PROPERTY": "Commercial",
            "COMMERCIAL SPACE": "Commercial",
            "STUDIO APARTMENT": "Studio Apartment",
            "PARKING – GARAGE": "None",
            BUNGALOW: "Bungalow",
            APARTMENTS: "Apartment",
            APARTMENT: "Apartment",
            "APARTMENT / FLAT": "Apartment",
            "SEMI-DETACHED": "Villa",
            "SEMI-DETACHED VILLA": "Villa",
            QUAD: "Villa",
            TERRACED: "Townhouse",
          };
          const value = valueFromXML?._text || valueFromXML;

          // console.log({
          //   key,
          //   crmApiKey,
          //   valueFromXML: valueFromXML?._text.toUpperCase(),
          //   option: map[valueFromXML?._text.toUpperCase()],
          // });
          // check wheather xml value is found in propertyTypes if fund put it to updatedCRMJSON otherwise do nothing
          const isFound = map[value.toUpperCase()];
          // if (key == "type._cdata" || key == "type") {
          //   console.log("inside", { key, value, isFound });
          // }
          if (!isFound) {
            console.log("key:type", { value });
            return;
          }
          types.push({ [crmApiKey]: isFound });
          updatedCRMJSON[crmApiKey] = isFound;
          return;
        }

        //if crm key is Area add '- ' before value
        if (key === "town" && crmApiKey === "Area") {
          updatedCRMJSON[crmApiKey] =
            "- " + valueFromXML?._text || valueFromXML;
          return;
        }
        //handle pool
        if (key === "pool") {
          const feature = [xmlJSON?.["features"]?.["feature"] || []].flat();
          const isPrivatePoolFound = feature.find(
            (itm) =>
              itm?._text.toLowerCase().includes("pool") &&
              itm?._text.toLowerCase().includes("private")
          );
          const isCommunalPoolFound = feature.find(
            (itm) =>
              itm?._text.toLowerCase().includes("pool") &&
              itm?._text.toLowerCase().includes("communal")
          );

          //grab property type
          const propertyType = property?.["type"] || property?.["type._cdata"];
          const propertyValue =
            propertyType == "type._cdata"
              ? xmlJSON["type"]._cdata
              : xmlJSON["type"]._text;

          //if property type includes villa then pool will be Private otherwise Communal
          const poolValueBasedOnPropertyType = propertyValue
            .toLowerCase()
            .includes("villa")
            ? "Private"
            : "Communal";

          const value =
            serviceMapForPropertyMarketing[
              isPrivatePoolFound?._text.toLowerCase()
            ] ||
            serviceMapForPropertyMarketing[
              isCommunalPoolFound?._text.toLowerCase()
            ] ||
            poolValueBasedOnPropertyType;

          updatedCRMJSON[crmApiKey] = value;
          return;
        }

        if (key === "feed_agent") {
          const ref = referenceKey;
          let prefix;
          if (valueFromXML?._text === "Villas Amarillas") {
            prefix = "HE-16";
          } else if (valueFromXML?._text === "Sun Villas Murcia") {
            prefix = "MH-30";
          } else if (valueFromXML?._text === "Daimper International") {
            prefix = "NCB-66";
          } else if (valueFromXML?._text === "Orange villas") {
            prefix = "NCB-07";
          } else if (valueFromXML?._text === "Plus villas") {
            prefix = "NCB-42";
          }
          updatedCRMJSON[crmApiKey] = prefix + ref;
          return;
        }

        try {
          if (valueFromXML._text == crmJSON[referenceKey][crmApiKey]) {
            // If Matches Return
            return;
          }
        } catch (err) {
          // console.log(crmApiKey, crmJSON[referenceKey][crmApiKey], err.message);
        }
        updatedCRMJSON[crmApiKey] = valueFromXML?._text || valueFromXML;
      });

      //we need to process new_build for ecery record thats why we are checking this seperately
      //if new_build tag isn't found then we need to assign Resale
      //if value is 1 then value is "New Build" otherwise "Resale"
      if (!xmlJSON.new_build) {
        const crmApiKey = propertyMarketingFieldMapping["new_build"];

        updatedCRMJSON[crmApiKey] = "Resale";
      }

      if (xmlJSON.new_build) {
        const crmApiKey = propertyMarketingFieldMapping["new_build"];
        const value = xmlJSON.new_build._text || xmlJSON.new_build;

        updatedCRMJSON[crmApiKey] = value == 1 ? "New Build" : "Resale";
      }
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

      let updatedImageList = xmlImageList
        .map(
          (img, index) =>
            `${index + 1} - ${img}${
              index !== xmlImageList.length - 1 ? "\n" : ""
            }`
        )
        .join("");

      updatedCRMJSON[propertyMarketingFieldMapping["images.image"]] =
        updatedImageList;

      //convert feature to array
      const feature = [xmlJSON?.["features"]?.["feature"] || []].flat();
      // console.log({ feature });

      //handle fatures
      feature?.forEach((itm) => {
        const crmApiKey =
          propertyMarketingFieldMapping?.[itm?._text.toLowerCase()];
        // Fitted Kitchen
        if (!crmApiKey) {
          return;
        }
        const valueFromCRM = crmJSON?.[referenceKey]?.[crmApiKey];

        let value;

        if (propertyMarketingFeatures.includes(itm?._text.toLowerCase())) {
          value = "YES";
        } else {
          value = "NO";
        }

        value =
          serviceMapForPropertyMarketing?.[itm?._text.toLowerCase()] || value;
        // console.log({ crmApiKey, xmlVal: itm._text, value });

        if (valueFromCRM == value) {
          return;
        }

        updatedCRMJSON[crmApiKey] = value;
      });
      // console.log({ updatedCRMJSON });

      if (Object.keys(updatedCRMJSON).length > 0) {
        // updatedCRMJSON.Status = "Live";
        updatedCRMJSON.Agent_Property = true;
        updatedCRMData.push({
          Update_Json: JSON.stringify(updatedCRMJSON),
          XML_Data:
            "<property>" +
            convert.json2xml(xmlJSON, {
              compact: true,
              spaces: 2,
            }) +
            "</property>",
          Properties: crmJSON?.[referenceKey]?.["id"],
          // Original_JSON: JSON.stringify(crmJSON?.[referenceKey]),
          // Update_Status: "Pending",
          // XML_Source: "homeespananewbuild",
        });
        if (test != true) {
          if (updatedCRMData.length == 100) {
            try {
              const ress = await fastify.axios({
                url: "https://sandbox.zohoapis.eu/crm/v7/Property_Update_Log",
                data: { data: updatedCRMData },
                headers: { Authorization: accessToken },
                method: "POST",
              });
              returnData.push(ress?.data?.data);
            } catch (error) {
              // console.log({ error });
            }
            updatedCRMData = [];
          }
        }
      }
    }
    // console.log(updatedCRMData);
    if (test != true) {
      if (updatedCRMData.length > 0) {
        try {
          const ress = await fastify.axios({
            url: "https://sandbox.zohoapis.eu/crm/v7/Property_Update_Log",
            data: { data: updatedCRMData },
            headers: { Authorization: accessToken },
            method: "POST",
          });
          returnData.push(ress?.data?.data);
        } catch (error) {
          // console.log({ error });
        }
      }
    }

    // return returnData;
    return {
      // returnData,
      // xmlProperties,
      types,
      // updatedCRMData,

      // xmlPropertiesLength: xmlProperties.length,
      // XML_Data: updatedCRMData.map((item) => item.XML_Data),
      // updatedCRMData: updatedCRMData.map((item) =>
      //   JSON.parse(item.Update_Json)
      // ),
    };
  });
};
