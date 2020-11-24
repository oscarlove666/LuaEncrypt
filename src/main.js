let dota2file = "C:/Steam/steamapps/common/dota 2 beta/"
let 项目名字 = "custom_chaos";

//加密使用的key，此处为硬编码 （换成GetDedicatedServerKeyV2可以提高安全性）
let PASSWORD = "PASSWORD6789";

//需要加密的文件路径
let toEncryptFilePaths = [
  'pvp_module.lua',
  'round.lua',
  'summon.lua',
  'hero_builder.lua',
  'heroes/hero_arc_warden/arc_warden_tempest_double_lua.lua',
  'item_ability/modifier/modifier_item_dark_moon_shard.lua',
  'bot_ai.lua',
  'heroes/hero_sandking/modifier_sand_king_caustic_finale_lua_debuff.lua',
  'heroes/hero_nevermore/shadow_fiend_requiem_of_souls_lua.lua',
  'econ.lua',
];

import luaSimpleXorEncrypt from './LuaSimpleXorEncrypt';
var fs = require('fs')
var path = require('path')

var deleteFolder = function(url,isSubfolder) {
        var files = [];
        /**
         * 判断给定的路径是否存在
         */
        if (fs.existsSync(url)) {
            /**
             * 返回文件和子目录的数组
             */
            files = fs.readdirSync(url);
            files.forEach(function (file, index) {

                var curPath = path.join(url, file);
                /**
                 * fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
                 */
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    deleteFolder(curPath,true);

                } else {
                    fs.unlinkSync(curPath);
                }
            });
            /**
             * 清除文件夹
             */
            if (isSubfolder)
            {
              fs.rmdirSync(url);
            }
        } else {

        }
    }


var copyFile = function(srcPath, tarPath, cb) {
  var rs = fs.createReadStream(srcPath);
  rs.on('error', function(err) {
    if (err) {
      console.log(err);
      console.log('read error', srcPath);
    }
    cb && cb(err);
  })
 
  var ws = fs.createWriteStream(tarPath);
  ws.on('error', function(err) {
    if (err) {
      console.log(err);
      console.log('write error', tarPath);
    }
    cb && cb(err);
  })
  ws.on('close', function(ex) {
    cb && cb(ex);
  })
 
  rs.pipe(ws);
}


//! 将srcDir文件下的文件、文件夹递归的复制到tarDir下
var copyFolder = function(srcDir, tarDir, cb) {
  fs.readdir(srcDir, function(err, files) {
    var count = 0;
    var checkEnd = function() {
      ++count == files.length && cb && cb();
    }
 
    if (err) {
      checkEnd();
      return;
    }
 
    files.forEach(function(file) {
      var srcPath = path.join(srcDir, file);
      var tarPath = path.join(tarDir, file);
 
      fs.stat(srcPath, function(err, stats) {
        if (stats.isDirectory()) {
          console.log('mkdir', tarPath);
          fs.mkdir(tarPath, function(err) {
            if (err) {
              console.log(err);
              return;
            }
            copyFolder(srcPath, tarPath, checkEnd);
          });
        } else {
          copyFile(srcPath, tarPath, checkEnd);
        }
      });
    });
 
    //为空时直接回调
    files.length === 0 && cb && cb();
  });
 }

console.log("Encrypt Begin...");

let 引入 = "/dota_addons/"+项目名字 ;
let 导出 = "/dota_addons/"+项目名字+"_release" ;
let cachetitle = dota2file+"game"+引入+'/scripts/vscripts/';

//清空目标文件夹
deleteFolder(dota2file+'content'+导出 ,false)
deleteFolder(dota2file+'game'+导出 ,false)

//拷贝content
copyFolder(dota2file+'content'+引入 ,dota2file+'content'+导出 )

//拷贝game
copyFolder(dota2file+'game'+引入 ,dota2file+'game'+导出 ,function() {
	//遍历文件进行加密
	toEncryptFilePaths.forEach(function(filePath) {
        var cacheFile = cachetitle +filePath;
        fs.readFile(cacheFile, function (err,bytes) {
		    if (err) throw err;
		    let encrypted = luaSimpleXorEncrypt(bytes, PASSWORD);
	        fs.writeFile(cacheFile, encrypted, function (error) {	        
	        })
		});
	})
})


