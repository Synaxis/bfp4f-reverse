char __cdecl LobbyBase64Decode(int a1, int a2, int a3)
{
  int v3; // edx
  int v4; // edi
  int v5; // esi
  signed int v6; // ecx
  char v7; // al
  char v8; // dl
  char v9; // cl
  char v10; // al
  int v11; // eax
  int v12; // eax
  char v14; // [esp+13h] [ebp-5h]
  int v15; // [esp+14h] [ebp-4h]

  v3 = a1;
  v4 = 0;
  v5 = 0;
  if ( a1 <= 0 )
  {
LABEL_28:
    v11 = 0;
    if ( a3 )
    {
      LOBYTE(v12) = v4 == v3;
    }
    else
    {
      LOBYTE(v11) = v4 != v3;
      v12 = v5 & (v11 - 1);
    }
  }
  else
  {
    while ( 1 )
    {
      v6 = 0;
      do
      {
        if ( v4 >= v3 )
          break;
        v7 = *(_BYTE *)(v4 + a2);
        if ( !v7 )
          break;
        if ( v7 != 32 && v7 != 9 && v7 != 13 && v7 != 10 )
        {
          if ( v7 < 43 || v7 > 122 )
            goto LABEL_35;
          *((_BYTE *)&v15 + v6++) = v7;
        }
        ++v4;
      }
      while ( v6 < 4 );
      if ( !v6 )
        goto LABEL_28;
      if ( v6 < 4 )
        goto LABEL_35;
      v8 = byte_107F6CD[(char)v15];
      v9 = byte_107F6CD[SBYTE1(v15)];
      v10 = byte_107F6CD[SBYTE2(v15)];
      v14 = byte_107F6CD[SHIBYTE(v15)];
      if ( v8 < 0 || v9 < 0 )
        goto LABEL_35;
      if ( v10 < 0 )
        goto LABEL_30;
      if ( byte_107F6CD[SHIBYTE(v15)] < 0 )
        break;
      if ( a3 )
      {
        *(_BYTE *)(v5 + a3) = 4 * v8 | (v9 >> 4) & 3;
        *(_BYTE *)(v5 + a3 + 1) = 16 * v9 | (v10 >> 2) & 0x3F;
        *(_BYTE *)(v5 + a3 + 2) = v14 | (v10 << 6);
      }
      v3 = a1;
      v5 += 3;
      if ( v4 >= a1 )
        goto LABEL_28;
    }
    if ( HIBYTE(v15) == 61 )
    {
      if ( a3 )
      {
        *(_BYTE *)(v5 + a3) = 4 * v8 | (v9 >> 4) & 3;
        *(_BYTE *)(v5 + a3 + 1) = 16 * v9 | (v10 >> 2) & 0x3F;
      }
      v5 += 2;
LABEL_27:
      v4 = a1;
      v3 = a1;
      goto LABEL_28;
    }
LABEL_30:
    if ( BYTE2(v15) == 61 && HIBYTE(v15) == 61 )
    {
      if ( a3 )
        *(_BYTE *)(v5 + a3) = 4 * v8 | (v9 >> 4) & 3;
      ++v5;
      goto LABEL_27;
    }
LABEL_35:
    LOBYTE(v12) = 0;
  }
  return v12;
}