const fs = require("fs-extra");
const path = require("path");
const Papa = require("papaparse");

function main() {
  const inspopDataCSVPath = path.join(__dirname, "public", "inspop-data.csv");

  // 使用 fs-extra 来读取文件
  const inspopData = fs.readFileSync(inspopDataCSVPath, "utf8");

  const results = Papa.parse(inspopData, { header: true });
  const csvData = results.data;
  const wallpapers_dir_json = {};
  for (let m = 0; m < csvData.length; m++) {
    if (csvData[m]["wallpapers_dir"]) {
      console.log("csvData[m]", csvData[m]);
      const current_wallpapers_dir_name = csvData[m]["wallpapers_dir"];
      const current_wallpapers_dir = path.join(
        __dirname,
        "public",
        "wallpapers",
        current_wallpapers_dir_name
      );

      console.group("--current_wallpapers_dir-", current_wallpapers_dir);
      const current_wallpapers_dir_files = fs.readdirSync(
        current_wallpapers_dir
      );
      console.log(
        "==current_wallpapers_dir_files==",
        current_wallpapers_dir_files
      );

      const new_current_wallpapers_dir_files = [];

      for(let n = 0; n < current_wallpapers_dir_files.length; n++){
        if(['.DS_Store'].includes(current_wallpapers_dir_files[n]) === false){
            new_current_wallpapers_dir_files.push(current_wallpapers_dir_files[n])
        }
      }

      wallpapers_dir_json[current_wallpapers_dir_name] =
      new_current_wallpapers_dir_files;
    }
  }

  // 文件路径
  const wallpapersInfoJsonPath = path.join(
    __dirname,
    "public",
    "wallpapers-info.json"
  );

  // 将JSON数据写入文件
  fs.writeJsonSync(wallpapersInfoJsonPath, wallpapers_dir_json, { spaces: 2 });
}

main();