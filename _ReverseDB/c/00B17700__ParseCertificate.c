int __cdecl ParseCertificate(void *Dst, int a2, size_t Size)
{
  unsigned __int8 *v3; // ebx
  unsigned __int8 *v4; // eax
  unsigned __int8 *v5; // eax
  bool v6; // zf
  unsigned __int8 *v7; // esi
  unsigned __int8 *v8; // eax
  unsigned int v9; // ecx
  unsigned __int8 *v10; // eax
  int v11; // edx
  int result; // eax
  unsigned __int8 *v13; // ebx
  size_t v14; // edi
  size_t v15; // ST18_4
  unsigned __int8 *v16; // eax
  unsigned __int8 *v17; // eax
  int v18; // eax
  unsigned __int8 *v19; // eax
  unsigned __int8 *v20; // ebx
  unsigned __int8 *v21; // ebp
  signed int v22; // ebx
  signed int v23; // esi
  _BYTE *v24; // eax
  int v25; // ebp
  int v26; // ebp
  int v27; // ebp
  int v28; // ebp
  _BYTE *v29; // edi
  signed int i; // ebp
  int v31; // ebp
  unsigned __int8 *v32; // esi
  unsigned __int8 *v33; // eax
  unsigned __int8 *v34; // eax
  size_t v35; // edi
  _BYTE *v36; // ecx
  signed int v37; // edx
  int v38; // ebp
  unsigned __int8 *v39; // eax
  size_t v40; // edi
  _BYTE *v41; // ecx
  signed int v42; // edx
  int v43; // ebp
  unsigned __int8 *v44; // eax
  unsigned __int8 *v45; // ebx
  int v46; // ebp
  unsigned __int8 *v47; // edx
  signed int v48; // ebx
  unsigned __int8 *v49; // eax
  signed int v50; // esi
  int v51; // edi
  int v52; // edi
  int v53; // edi
  int v54; // edi
  unsigned __int8 *v55; // edi
  signed int v56; // ebp
  int v57; // edi
  unsigned __int8 *v58; // esi
  unsigned __int8 *v59; // eax
  unsigned __int8 *v60; // eax
  unsigned __int8 *v61; // ebp
  unsigned __int8 *v62; // eax
  int v63; // eax
  unsigned __int8 *v64; // esi
  unsigned __int8 *v65; // eax
  unsigned __int8 *v66; // eax
  unsigned __int8 *v67; // ebp
  int v68; // esi
  signed int v69; // ebx
  unsigned __int8 *v70; // eax
  signed int v71; // ecx
  signed int v72; // esi
  unsigned __int8 *v73; // edi
  unsigned __int8 *v74; // eax
  unsigned __int8 *v75; // ebp
  unsigned __int8 *v76; // eax
  int v77; // eax
  unsigned __int8 *v78; // esi
  unsigned __int8 *v79; // eax
  size_t v80; // ST18_4
  unsigned __int8 *v81; // esi
  unsigned __int8 *v82; // eax
  unsigned __int8 *v83; // ebx
  size_t v84; // edi
  size_t v85; // eax
  unsigned __int8 *v86; // ecx
  unsigned __int8 *v87; // eax
  signed int v88; // ecx
  int v89; // [esp+10h] [ebp-80h]
  int v90; // [esp+14h] [ebp-7Ch]
  unsigned __int8 *v91; // [esp+18h] [ebp-78h]
  unsigned __int8 *v92; // [esp+1Ch] [ebp-74h]
  void *Src; // [esp+20h] [ebp-70h]
  unsigned __int8 *v94; // [esp+24h] [ebp-6Ch]
  unsigned __int8 *v95; // [esp+28h] [ebp-68h]
  size_t v96; // [esp+2Ch] [ebp-64h]
  unsigned __int8 *v97; // [esp+30h] [ebp-60h]
  int v98; // [esp+34h] [ebp-5Ch]
  int v99; // [esp+98h] [ebp+8h]
  unsigned __int8 *v100; // [esp+98h] [ebp+8h]

  v3 = (unsigned __int8 *)(Size + a2);
  v91 = (unsigned __int8 *)(Size + a2);
  memset(Dst, 0, 0xA20u);
  v4 = sub_B17590((unsigned __int8 *)a2, &v89, &Size, v3);
  if ( !v4 || v89 != 48 )
    return -1;
  Src = v4;
  v5 = sub_B17590(v4, &v89, &Size, v3);
  if ( !v5 || v89 != 48 )
    return -2;
  v6 = *v5 == 2;
  v7 = &v5[Size];
  v92 = &v5[Size];
  if ( !v6 )
  {
    if ( v5 == v3 )
      return -3;
    v8 = v5 + 1;
    if ( v8 == v3 )
      return -3;
    v9 = *v8;
    v10 = v8 + 1;
    if ( v9 > 0x7F )
    {
      v11 = v9 & 0x7F;
      v9 = 0;
      if ( v11 > 0 )
      {
        while ( v10 != v3 )
        {
          --v11;
          v9 = *v10++ | (v9 << 8);
          if ( v11 <= 0 )
            goto LABEL_12;
        }
        return -3;
      }
    }
LABEL_12:
    Size = v9;
    if ( !v10 )
      return -3;
    v5 = &v10[v9];
  }
  v13 = sub_B17590(v5, &v89, &Size, v7);
  if ( !v13 )
    return -4;
  v14 = Size;
  if ( (Size & 0x80000000) != 0 || Size > 0x20 )
    return -4;
  v15 = Size;
  *((_DWORD *)Dst + 368) = Size;
  memcpy((char *)Dst + 1476, v13, v15);
  v16 = sub_B17590(&v13[v14], &v89, &Size, v7);
  if ( !v16 || v89 != 48 )
    return -5;
  v94 = &v16[Size];
  v17 = sub_B17590(v16, &v89, &Size, v7);
  if ( !v17 || v89 != 6 )
    return -6;
  v18 = sub_B17600(Size, (int)v17);
  *((_DWORD *)Dst + 377) = v18;
  if ( !v18 )
    return -7;
  v19 = sub_B17590(v94, &v89, &Size, v7);
  if ( !v19 || v89 != 48 )
    return -8;
  v20 = &v19[Size];
  v95 = &v19[Size];
  v90 = 0;
  v21 = sub_B17590(v19, &v89, &Size, &v19[Size]);
  v99 = (int)v21;
  if ( v21 )
  {
    while ( 1 )
    {
      if ( v89 == 48 || v89 == 49 )
        goto LABEL_77;
      v22 = Size;
      if ( v89 != 6 )
        break;
      v90 = sub_B17600(Size, (int)v21);
LABEL_76:
      v21 += v22;
      v20 = v95;
LABEL_77:
      v21 = sub_B17590(v21, &v89, &Size, v20);
      v99 = (int)v21;
      if ( !v21 )
        goto LABEL_78;
    }
    if ( v89 != 19 && v89 != 12 && v89 != 20 )
      goto LABEL_76;
    switch ( v90 )
    {
      case 1:
        v23 = 32;
        v24 = Dst;
        if ( (signed int)Size > 0 )
        {
          v25 = v21 - (_BYTE *)Dst;
          do
          {
            if ( v23 <= 1 )
              break;
            --v23;
            *v24 = v24[v25];
            ++v24;
          }
          while ( v22 + v23 - 32 > 0 );
          break;
        }
LABEL_74:
        *v24 = 0;
        goto LABEL_75;
      case 2:
        v23 = 32;
        v24 = (char *)Dst + 32;
        if ( (signed int)Size <= 0 )
          goto LABEL_74;
        v26 = v21 - v24;
        do
        {
          if ( v23 <= 1 )
            break;
          --v23;
          *v24 = v24[v26];
          ++v24;
        }
        while ( v22 + v23 - 32 > 0 );
        break;
      case 3:
        v23 = 32;
        v24 = (char *)Dst + 64;
        if ( (signed int)Size <= 0 )
          goto LABEL_74;
        v27 = v21 - v24;
        do
        {
          if ( v23 <= 1 )
            break;
          --v23;
          *v24 = v24[v27];
          ++v24;
        }
        while ( v22 + v23 - 32 > 0 );
        break;
      case 4:
        v23 = 32;
        v24 = (char *)Dst + 96;
        if ( (signed int)Size <= 0 )
          goto LABEL_74;
        v28 = v21 - v24;
        do
        {
          if ( v23 <= 1 )
            break;
          --v23;
          *v24 = v24[v28];
          ++v24;
        }
        while ( v22 + v23 - 32 > 0 );
        break;
      case 5:
        if ( *((_BYTE *)Dst + 128) )
          sub_B0B240((char *)Dst + 128, ", ", 256);
        v24 = (char *)Dst + 128;
        v29 = (_BYTE *)v99;
        v23 = 256;
        for ( i = v22; *v24; --v23 )
        {
          if ( v23 <= 1 )
            break;
          ++v24;
        }
        if ( v22 > 0 )
        {
          do
          {
            if ( v23 <= 1 )
              break;
            *v24 = *v29;
            --i;
            ++v24;
            ++v29;
            --v23;
          }
          while ( i > 0 );
        }
        break;
      case 6:
        v23 = 64;
        v24 = (char *)Dst + 384;
        if ( (signed int)Size <= 0 )
          goto LABEL_74;
        v31 = v21 - v24;
        do
        {
          if ( v23 <= 1 )
            break;
          --v23;
          *v24 = v24[v31];
          ++v24;
        }
        while ( v22 + v23 - 64 > 0 );
        break;
      default:
        goto LABEL_75;
    }
    if ( v23 > 0 )
      goto LABEL_74;
LABEL_75:
    v21 = (unsigned __int8 *)v99;
    v90 = 0;
    goto LABEL_76;
  }
LABEL_78:
  v32 = v91;
  v33 = sub_B17590(v20, &v89, &Size, v91);
  if ( !v33 || v89 != 48 )
    return -9;
  v34 = sub_B17590(v33, &v89, &Size, v32);
  if ( !v34 || v89 != 23 && v89 != 24 )
    return -10;
  v35 = Size;
  v36 = (char *)Dst + 896;
  v37 = 32;
  if ( (signed int)Size <= 0 )
    goto LABEL_243;
  v38 = v34 - v36;
  do
  {
    if ( v37 <= 1 )
      break;
    --v37;
    *v36 = v36[v38];
    ++v36;
  }
  while ( (signed int)(v35 + v37 - 32) > 0 );
  if ( v37 > 0 )
LABEL_243:
    *v36 = 0;
  v39 = sub_B17590(&v34[v35], &v89, &Size, v32);
  if ( !v39 || v89 != 23 && v89 != 24 )
    return -11;
  v40 = Size;
  v41 = (char *)Dst + 928;
  v42 = 32;
  if ( (signed int)Size <= 0 )
    goto LABEL_244;
  v43 = v39 - v41;
  do
  {
    if ( v42 <= 1 )
      break;
    --v42;
    *v41 = v41[v43];
    ++v41;
  }
  while ( (signed int)(v40 + v42 - 32) > 0 );
  if ( v42 > 0 )
LABEL_244:
    *v41 = 0;
  v44 = sub_B17590(&v39[v40], &v89, &Size, v32);
  if ( !v44 || v89 != 48 )
    return -12;
  v45 = &v44[Size];
  v95 = &v44[Size];
  v46 = 0;
  v47 = sub_B17590(v44, &v89, &Size, &v44[Size]);
  v100 = v47;
  if ( v47 )
  {
    while ( v89 == 48 || v89 == 49 )
    {
LABEL_154:
      v100 = sub_B17590(v47, &v89, &Size, v45);
      if ( !v100 )
        goto LABEL_155;
      v47 = v100;
    }
    v48 = Size;
    if ( v89 == 6 )
    {
      v46 = sub_B17600(Size, (int)v47);
LABEL_152:
      v47 = v100;
LABEL_153:
      v47 += v48;
      v45 = v95;
      goto LABEL_154;
    }
    if ( v89 != 19 && v89 != 12 && v89 != 20 )
      goto LABEL_153;
    switch ( v46 )
    {
      case 1:
        v49 = (unsigned __int8 *)Dst + 448;
        v50 = 32;
        if ( (signed int)Size > 0 )
        {
          v51 = v47 - v49;
          do
          {
            if ( v50 <= 1 )
              break;
            --v50;
            *v49 = v49[v51];
            ++v49;
          }
          while ( v48 + v50 - 32 > 0 );
          break;
        }
LABEL_150:
        *v49 = 0;
        goto LABEL_151;
      case 2:
        v49 = (unsigned __int8 *)Dst + 480;
        v50 = 32;
        if ( (signed int)Size <= 0 )
          goto LABEL_150;
        v52 = v47 - v49;
        do
        {
          if ( v50 <= 1 )
            break;
          --v50;
          *v49 = v49[v52];
          ++v49;
        }
        while ( v48 + v50 - 32 > 0 );
        break;
      case 3:
        v49 = (unsigned __int8 *)Dst + 512;
        v50 = 32;
        if ( (signed int)Size <= 0 )
          goto LABEL_150;
        v53 = v47 - v49;
        do
        {
          if ( v50 <= 1 )
            break;
          --v50;
          *v49 = v49[v53];
          ++v49;
        }
        while ( v48 + v50 - 32 > 0 );
        break;
      case 4:
        v49 = (unsigned __int8 *)Dst + 544;
        v50 = 32;
        if ( (signed int)Size <= 0 )
          goto LABEL_150;
        v54 = v47 - v49;
        do
        {
          if ( v50 <= 1 )
            break;
          --v50;
          *v49 = v49[v54];
          ++v49;
        }
        while ( v48 + v50 - 32 > 0 );
        break;
      case 5:
        if ( *((_BYTE *)Dst + 576) )
          sub_B0B240((char *)Dst + 576, ", ", 256);
        v49 = (unsigned __int8 *)Dst + 576;
        v55 = v100;
        v50 = 256;
        v56 = v48;
        if ( *((_BYTE *)Dst + 576) )
        {
          do
          {
            if ( v50 <= 1 )
              break;
            ++v49;
            --v50;
          }
          while ( *v49 );
        }
        if ( v48 > 0 )
        {
          do
          {
            if ( v50 <= 1 )
              break;
            *v49 = *v55;
            --v56;
            ++v49;
            ++v55;
            --v50;
          }
          while ( v56 > 0 );
        }
        break;
      case 6:
        v49 = (unsigned __int8 *)Dst + 832;
        v50 = 64;
        if ( (signed int)Size <= 0 )
          goto LABEL_150;
        v57 = v47 - v49;
        do
        {
          if ( v50 <= 1 )
            break;
          --v50;
          *v49 = v49[v57];
          ++v49;
        }
        while ( v48 + v50 - 64 > 0 );
        break;
      default:
        goto LABEL_151;
    }
    if ( v50 > 0 )
      goto LABEL_150;
LABEL_151:
    v46 = 0;
    goto LABEL_152;
  }
LABEL_155:
  v58 = v91;
  v59 = sub_B17590(v45, &v89, &Size, v91);
  if ( !v59 || v89 != 48 )
    return -13;
  v60 = sub_B17590(v59, &v89, &Size, v58);
  if ( !v60 || v89 != 48 )
    return -14;
  v61 = &v60[Size];
  v62 = sub_B17590(v60, &v89, &Size, &v60[Size]);
  if ( !v62 || v89 != 6 )
    return -15;
  v63 = sub_B17600(Size, (int)v62);
  v64 = v91;
  *((_DWORD *)Dst + 507) = v63;
  v65 = sub_B17590(v61, &v89, &Size, v64);
  if ( !v65 || v89 != 3 || (signed int)Size < 1 )
    return -16;
  v97 = v65 + 1;
  v96 = Size - 1;
  v66 = sub_B17590(&v65[Size], &v89, &Size, v64);
  if ( v66 )
  {
    if ( v89 == 163 )
    {
      v95 = &v66[Size];
      v90 = 0;
      v67 = sub_B17590(v66, &v89, &Size, &v66[Size]);
      if ( v67 )
      {
        while ( 1 )
        {
          v68 = v89;
          if ( v89 == 48 || v89 == 49 )
            goto LABEL_185;
          v69 = Size;
          if ( v89 == 6 )
            v90 = sub_B17600(Size, (int)v67);
          if ( v90 != 7 )
            goto LABEL_184;
          if ( v68 != 4 )
            break;
LABEL_185:
          v67 = sub_B17590(v67, &v89, &Size, v95);
          if ( !v67 )
            goto LABEL_186;
        }
        if ( v68 == 130 )
        {
          if ( *((_BYTE *)Dst + 960) )
            sub_B0B240((char *)Dst + 960, &unk_1056B9C, 512);
          v70 = (unsigned __int8 *)Dst + 960;
          v71 = 512;
          v72 = v69;
          v73 = v67;
          if ( *((_BYTE *)Dst + 960) )
          {
            do
            {
              if ( v71 <= 1 )
                break;
              ++v70;
              --v71;
            }
            while ( *v70 );
          }
          if ( v69 > 0 )
          {
            do
            {
              if ( v71 <= 1 )
                break;
              *v70 = *v73;
              --v72;
              ++v70;
              ++v73;
              --v71;
            }
            while ( v72 > 0 );
          }
          if ( v71 > 0 )
            *v70 = 0;
        }
LABEL_184:
        v67 += v69;
        goto LABEL_185;
      }
    }
  }
LABEL_186:
  v74 = sub_B17590(v92, &v89, &Size, v94);
  if ( !v74 || v89 != 48 )
    return -18;
  v75 = &v74[Size];
  v76 = sub_B17590(v74, &v89, &Size, &v74[Size]);
  if ( !v76 || v89 != 6 )
    return -19;
  v77 = sub_B17600(Size, (int)v76);
  v78 = v91;
  *((_DWORD *)Dst + 377) = v77;
  v79 = sub_B17590(v75, &v89, &Size, v78);
  if ( !v79 || v89 != 3 || (signed int)Size < 1 )
    return -20;
  if ( (signed int)Size > 513 )
    return -21;
  v80 = Size - 1;
  *((_DWORD *)Dst + 378) = Size - 1;
  memcpy((char *)Dst + 1516, v79 + 1, v80);
  if ( *((_DWORD *)Dst + 507) == 8 )
  {
    v81 = &v97[v96];
    v82 = sub_B17590(v97, &v89, &Size, &v97[v96]);
    if ( !v82 || v89 != 48 )
      return -22;
    v83 = sub_B17590(v82, &v89, &Size, v81);
    if ( !v83 )
      return -23;
    if ( v89 != 2 )
      return -23;
    v84 = Size;
    if ( (signed int)Size < 4 )
      return -23;
    v85 = Size;
    v86 = v83;
    if ( !*v83 )
    {
      v86 = v83 + 1;
      v85 = Size - 1;
    }
    if ( v85 > 0x200 )
      return -24;
    *((_DWORD *)Dst + 508) = v85;
    memcpy((char *)Dst + 2036, v86, v85);
    v87 = sub_B17590(&v83[v84], &v89, &Size, v81);
    if ( !v87 )
      return -25;
    if ( v89 != 2 )
      return -25;
    v88 = Size;
    if ( (signed int)Size < 1 )
      return -25;
    if ( !*v87 )
    {
      ++v87;
      v88 = Size - 1;
    }
    if ( v88 > 16 )
      return -26;
    *((_DWORD *)Dst + 637) = v88;
    memcpy((char *)Dst + 2552, v87, v88);
  }
  if ( *((_DWORD *)Dst + 377) == 9 )
  {
    sub_B1CA30(&v98);
    sub_B1CA50((int)&v98, Src, v92 - (_BYTE *)Src);
    *((_DWORD *)Dst + 642) = 16;
    sub_B1CAF0(&v98, (int)Dst + 2572, 16);
    result = 0;
  }
  else if ( *((_DWORD *)Dst + 377) == 10 )
  {
    CryptMD5Init(&v98);
    CryptMD5Update(&v98, Src, v92 - (_BYTE *)Src);
    *((_DWORD *)Dst + 642) = 16;
    CryptMD5Final(&v98, (char *)Dst + 2572, 16);
    result = 0;
  }
  else
  {
    if ( *((_DWORD *)Dst + 377) == 11 )
    {
      CryptSha1Init(&v98);
      CryptSha1Update((int)&v98, Src, v92 - (_BYTE *)Src);
      *((_DWORD *)Dst + 642) = 20;
      CryptSha1Final(&v98, (char *)Dst + 2572, 20);
    }
    else
    {
      *((_DWORD *)Dst + 642) = 0;
    }
    result = 0;
  }
  return result;
}