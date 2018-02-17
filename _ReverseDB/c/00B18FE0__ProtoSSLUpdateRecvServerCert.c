signed int __usercall ProtoSSLUpdateRecvServerCert@<eax>(unsigned __int8 *a1@<ecx>, int a2@<edi>)
{
  int v2; // eax
  int v3; // esi
  signed int v5; // [esp+8h] [ebp-4h]

  v2 = a1[5] | ((a1[4] | (a1[3] << 8)) << 8);
  v3 = *(_DWORD *)(a2 + 296);
  v5 = 21;
  if ( v2 > (a1[2] | ((a1[1] | (*a1 << 8)) << 8)) - 3 )
    return 4102;
  if ( ParseCertificate((void *)(v3 + 2116), (int)(a1 + 6), v2) < 0 )
    return 4099;
  if ( sub_B16870((char *)(a2 + 16), (char *)(v3 + 2948))
    && sub_B16960((const char *)(v3 + 3076), (const char *)(a2 + 16))
    && !*(_BYTE *)(a2 + 760) )
  {
    v5 = 4100;
  }
  if ( VerifyCertificate(a2, (size_t *)(v3 + 2116), 0) < 0 && !*(_BYTE *)(a2 + 760) )
    v5 = 4101;
  return v5;
}