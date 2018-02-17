signed int __usercall ProtoSSLUpdateRecvServerHello@<eax>(_BYTE *a1@<eax>, int a2@<ecx>)
{
  int v2; // ebp
  _BYTE *v3; // esi
  int v4; // ecx
  void **v5; // eax

  v2 = *(_DWORD *)(a2 + 296);
  if ( *a1 != 3 || a1[1] )
    return 4102;
  qmemcpy((void *)(v2 + 72), a1 + 2, 0x20u);
  v3 = &a1[(unsigned __int8)a1[34] + 35];
  *(_DWORD *)(v2 + 36) = 0;
  v4 = 0;
  v5 = &off_107EDA9;
  while ( *v3 != *((_BYTE *)v5 - 1) || v3[1] != *(_BYTE *)v5 )
  {
    v5 = (void **)((char *)v5 + 7);
    ++v4;
    if ( (signed int)v5 >= (signed int)"----BEGIN CERTIFICATE-----" )
      return 21;
  }
  *(_DWORD *)(v2 + 36) = &a66666666666666[7 * v4 + 96];
  return 21;
}