_DWORD *__cdecl CryptSha1Init(_DWORD *a1)
{
  _DWORD *result; // eax

  result = a1;
  *a1 = 0;
  a1[1] = 0;
  a1[2] = 0x67452301;
  a1[3] = 0xEFCDAB89;
  a1[4] = 0x98BADCFE;
  a1[5] = 0x10325476;
  a1[6] = 0xC3D2E1F0;
  return result;
}