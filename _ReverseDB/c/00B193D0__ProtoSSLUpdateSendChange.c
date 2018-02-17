signed int __usercall ProtoSSLUpdateSendChange@<eax>(int a1@<edi>)
{
  _DWORD *v1; // esi
  int v2; // eax
  int v3; // eax
  char v5; // [esp+4h] [ebp-4h]

  v1 = *(_DWORD **)(a1 + 296);
  v2 = v1[9];
  if ( *(_BYTE *)(v2 + 4) == 1 )
    sub_B0F2C0((char *)v1 + 858, v1[101], *(unsigned __int8 *)(v2 + 3), 1);
  v3 = v1[9];
  if ( *(_BYTE *)(v3 + 4) == 2 )
    sub_B1C790(v1 + 404, v1[101], *(unsigned __int8 *)(v3 + 3), 0, v1[103]);
  v5 = 1;
  SendPacket(1u, &v5, a1, 20, 0, 0);
  v1[1] = 0;
  return 24;
}