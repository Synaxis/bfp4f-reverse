signed int __cdecl ProtoSSLUpdateSendClientHello(int a1)
{
  const void *v1; // edi
  int v2; // edx
  char v3; // cl
  char *v4; // eax
  _BYTE *v5; // eax
  _BYTE *v6; // eax
  _BYTE *v7; // eax
  _BYTE *v8; // eax
  char v10; // [esp+10h] [ebp-104h]
  char v11; // [esp+11h] [ebp-103h]
  char v12; // [esp+12h] [ebp-102h]
  char v13; // [esp+13h] [ebp-101h]
  char v14; // [esp+14h] [ebp-100h]
  char v15; // [esp+15h] [ebp-FFh]
  char v16; // [esp+16h] [ebp-FEh]
  char v17; // [esp+36h] [ebp-DEh]
  char v18; // [esp+37h] [ebp-DDh]
  char v19; // [esp+38h] [ebp-DCh]
  char v20; // [esp+39h] [ebp-DBh]
  char v21; // [esp+3Ah] [ebp-DAh]
  char v22; // [esp+3Bh] [ebp-D9h]

  v1 = (const void *)(*(_DWORD *)(a1 + 296) + 40);
  v14 = 3;
  v15 = 0;
  sub_B168F0(32);
  v2 = *(_DWORD *)(a1 + 748);
  qmemcpy(&v16, v1, 0x20u);
  v3 = 0;
  v17 = 0;
  v18 = 0;
  v4 = &v20;
  if ( v2 & 1 )
  {
    v20 = 0;
    v21 = 5;
    v4 = &v22;
    v3 = 1;
  }
  if ( v2 & 2 )
  {
    *v4 = 0;
    v5 = v4 + 1;
    *v5 = 4;
    v4 = v5 + 1;
    ++v3;
  }
  if ( v2 & 4 )
  {
    *v4 = 0;
    v6 = v4 + 1;
    *v6 = 47;
    v4 = v6 + 1;
    ++v3;
  }
  if ( v2 & 8 )
  {
    *v4 = 0;
    v7 = v4 + 1;
    *v7 = 53;
    v4 = v7 + 1;
    ++v3;
  }
  v19 = 2 * v3;
  *v4 = 1;
  v8 = v4 + 1;
  *v8++ = 0;
  v12 = (unsigned __int16)(v8 - &v14) >> 8;
  v13 = (_BYTE)v8 - (unsigned int)&v14;
  v10 = 1;
  v11 = 0;
  SendPacket(4u, &v10, a1, 22, &v14, v8 - &v14);
  return 21;
}