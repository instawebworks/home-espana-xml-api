let sortable = [
  "https://admin.homeespana.co.uk/images/properties/1248888/8494152.jpg",
  "https://admin.homeespana.co.uk/images/properties/1248888/8494153.jpg",
];

let sortable2 = [
  "https://admin.homeespana.co.uk/images/properties/1248888/8494153.jpg",
  "https://admin.homeespana.co.uk/images/properties/1248888/8494152.jpg",
];

sortable = sortable.sort((a, b) => a.localeCompare(b));
sortable2 = sortable2.sort((a, b) => a.localeCompare(b));

if (JSON.stringify(sortable) == JSON.stringify(sortable2)) {
  // console.log("equal");
  // 
}
