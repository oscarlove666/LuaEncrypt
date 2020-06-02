import utf8 from 'utf8';
import luamin from 'luamin';
import simpleXorEncrypt from './SimpleXorEncrypt';
import shuffleWithKey from './ShuffleWithKey';

let templates = {
  credit: '',
  main: 'local main =',
  loadstring: 'loadstring',
  decoder: '((function (bytes, key_)\n'+
    'function bxor(a, b)\n'+
        'local XOR_l =\n'+
        '{\n'+
           '{0, 1},\n'+
           '{1, 0},\n'+
        '}\n'+
        'local pow = 1\n'+
        'local c = 0\n'+
        'while a > 0 or b > 0 do\n'+
            'c = c + (XOR_l[(a % 2) + 1][(b % 2) + 1] * pow)\n'+
            'a = math.floor(a / 2)\n'+
            'b = math.floor(b / 2)\n'+
            'pow = pow * 2\n'+
        'end\n'+
        'return c\n'+
    'end\n'+

    'local getDataBytes = function (bytes)\n'+
        'local result = {}\n'+
        'local i = 1\n'+
        'local index = bytes[i]\n'+
        'while (index >= 0) do\n'+
            'result[i] = bytes[index + 1]\n'+
            'i = i + 1\n'+
            'index = bytes[i]\n'+
        'end\n'+
        'return result\n'+
    'end\n'+

    'local decode = function (bytes, key_)\n'+
        'if #key_ <= 0 then\n'+
            'return {}\n'+
        'end\n'+
        'local i = 1\n'+
        'local j = 1\n'+
        'for i = 1, #bytes do\n'+
            'bytes[i] = bxor(bytes[i], string.byte(key_, j))\n'+
            'j = j + 1\n'+
            'if j > #key_ then\n'+
                'j = 1\n'+
            'end\n'+
        'end\n'+
        'return bytes\n'+
    'end\n'+

    'local bytesToString = function (bytes)\n'+
        'local result = ""\n'+
        'for i = 1, #bytes do\n'+
            'result = result .. string.char(bytes[i])\n'+
        'end\n'+
        'return result\n'+
    'end\n'+

    'return bytesToString(decode(getDataBytes(bytes), key_))\n'+
'end)({\n',
  decoderEnd:'}, key))\n'+
'if main then\n'+
    'main()\n'+
'else\n',
  keyWrongAlertCode: 'print("WRONG PASSWORD!")\n',
  keyWrongAlertEnd: 'end\n'
};

function luaSimpleXorEncrypt(bytes, key) {
  let encrypted = simpleXorEncrypt(bytes, utf8.encode(key));
  let shuffled = shuffleWithKey(encrypted, key);
  let code = 'key = "'+key+'" '
    + templates.main
    + templates.loadstring
    + templates.decoder
    + shuffled.join(',')
    + templates.decoderEnd
    + templates.keyWrongAlertCode
    + templates.keyWrongAlertEnd;
  return templates.credit
    + luamin.minify(code);
}

export default luaSimpleXorEncrypt;
