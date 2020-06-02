# Dota2 Lua Encrypt

##使用方法
1）新建一个新的Addon,作为加密后的目标文件夹 
   例如源文件 【C:/Steam/steamapps/common/dota 2 beta/game/dota_addons/custom_chaos】  
   新建一个为 【C:/Steam/steamapps/common/dota 2 beta/game/dota_addons/custom_chaos_release】     
2）安装nodejs  
3) 打开window 控制台进入目录 cd XXXXXX\LuaEncrypt\src  
4）npm install  
5）修改配置文件main.js 108行--119行 按照自己项目进行修改
6）运行  node start.js  

程序会自动将原始文件夹custom_chaos内的所有内容拷贝到custom_chaos_release中，并且对指定的Lua文件进行加密  

PS： 目前PASSWORD为硬编码。  可以使用 GetDedicatedServerKeyV2() 改为动态值，或者从服务器取， 更加难以解密。
