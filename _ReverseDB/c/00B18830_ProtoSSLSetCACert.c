signed int __cdecl ProtoSSLSetCACert(int a1, int a2, char a3)
{
  int v3; // ebx
  int v4; // esi
  int v5; // edi
  signed int v6; // eax
  signed int v7; // ebp
  dice::hfe::memory *v9; // eax
  dice::hfe::memory *v10; // esi
  signed int v11; // esi
  int v12; // ebx
  int v13; // esi
  signed int v14; // eax
  size_t v15; // edi
  dice::hfe::memory *v16; // ebp
  signed int v17; // esi
  int v18; // eax
  int v19; // [esp+10h] [ebp-A38h]
  int v20; // [esp+14h] [ebp-A34h]
  int v21; // [esp+18h] [ebp-A30h]
  int v22; // [esp+1Ch] [ebp-A2Ch]
  int v23; // [esp+20h] [ebp-A28h]
  dice::hfe::memory *v24; // [esp+24h] [ebp-A24h]
  char Dst; // [esp+28h] [ebp-A20h]
  int v26; // [esp+A4Ch] [ebp+4h]
  int v27; // [esp+A50h] [ebp+8h]

  v22 = -1;
  v24 = 0;
  if ( sub_B172F0(a1, (int)&v19) )
  {
    v4 = v19;
    v3 = v20;
  }
  else
  {
    v3 = a1;
    v4 = a1 + a2;
    v20 = a1;
    v19 = a1 + a2;
  }
  v27 = a1 - v4 + a2;
  v26 = v4;
  DirtyMemGroupQuery(&v21, &v23);
  v5 = v4 - v3;
  v6 = LobbyBase64Decode(v4 - v3, v3, 0);
  v7 = v6;
  if ( v6 > 0 )
  {
    if ( v6 > 4096 )
      return -111;
    v9 = (dice::hfe::memory *)DirtyMemAlloc(4096);
    v10 = v9;
    v24 = v9;
    if ( !v9 )
      return -112;
    LobbyBase64Decode(v5, v3, v9);
    v3 = (int)v10;
    v4 = (int)v10 + v7;
    v20 = v3;
    v19 = v4;
  }
  v11 = ParseCertificate(&Dst, v3, v4 - v3);
  if ( !v11 )
  {
    if ( !a3 || (v11 = VerifyCertificate(0, (size_t *)&Dst, 1)) == 0 )
    {
      v22 = AddCertificate(&Dst, a3, v21, v23);
      if ( !v11 )
      {
        do
        {
          if ( v27 <= 0 )
            break;
          if ( !sub_B172F0(v26, (int)&v19) )
            break;
          v27 += v26 - v19;
          v12 = v20;
          v26 = v19;
          v13 = v19 - v20;
          v14 = LobbyBase64Decode(v19 - v20, v20, 0);
          v15 = v14;
          if ( v14 <= 0 )
            break;
          if ( v14 > 4096 )
            break;
          v16 = v24;
          LobbyBase64Decode(v13, v12, v24);
          v17 = ParseCertificate(&Dst, (int)v16, v15);
          if ( v17 < 0 )
            break;
          if ( a3 )
          {
            v17 = VerifyCertificate(0, (size_t *)&Dst, 1);
            if ( v17 < 0 )
              break;
          }
          v18 = AddCertificate(&Dst, a3, v21, v23);
          v22 += v18;
        }
        while ( !v17 );
      }
    }
  }
  if ( v24 )
    DirtyMemFree(v24);
  return v22;
}