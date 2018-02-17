signed int __usercall ProtoSSLUpdateRecvChange@<eax>(int a1@<eax>)
{
  _DWORD *v1; // esi
  int v2; // eax
  int v3; // eax

  v1 = *(_DWORD **)(a1 + 296);
  v2 = v1[9];
  if ( *(_BYTE *)(v2 + 4) == 1 )
    sub_B0F2C0(v1 + 150, v1[100], *(unsigned __int8 *)(v2 + 3), 1);
  v3 = v1[9];
  if ( *(_BYTE *)(v3 + 4) == 2 )
    sub_B1C790(v1 + 279, v1[100], *(unsigned __int8 *)(v3 + 3), 1, v1[102]);
  v1[4] = 0;
  return 26;
}