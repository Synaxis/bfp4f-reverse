_DWORD *__cdecl CryptMD5Init(_DWORD *a1)
{
  _DWORD *result; // eax

  result = a1;
  a1[18] = 0;
  a1[19] = 0x67452301;
  a1[20] = 0xEFCDAB89;
  a1[21] = 0x98BADCFE;
  a1[22] = 0x10325476;
  return result;
}