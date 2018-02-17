int __usercall RecvHandshake@<eax>(int a1@<eax>, char a2)
{
  int v2; // eax
  int v3; // edx
  int v5; // ecx

  v2 = *(_DWORD *)(a1 + 296);
  v3 = *(_DWORD *)(v2 + 28);
  if ( *(_BYTE *)(v3 + v2 + 21092) != a2 )
    return 0;
  v5 = v3
     + (*(unsigned __int8 *)(v3 + v2 + 21095) | ((*(unsigned __int8 *)(v3 + v2 + 21094) | (*(unsigned __int8 *)(v3 + v2 + 21093) << 8)) << 8))
     + 4;
  if ( v5 > *(_DWORD *)(v2 + 24) )
    return 0;
  *(_DWORD *)(v2 + 28) = v5;
  return v3 + v2 + 21096;
}