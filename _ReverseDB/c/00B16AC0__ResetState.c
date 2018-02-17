int __usercall ResetState@<eax>(ProtoSSLRefT *a1@<esi>, int a2@<ebx>)
{
  int v2; // eax

  if ( a1->pSock )
  {
    *(_DWORD *)&a1[2].strHost[148] = SocketInfo((int)a1->pSock, 'serr', 0, 0, 0);
    sub_B09240((int)a1->pSock);
    a1->pSock = 0;
  }
  v2 = a1->pHost;
  if ( v2 )
  {
    (*(void (__cdecl **)(_DWORD))(v2 + 12))(a1->pHost);
    a1->pHost = 0;
  }
  a1->iState = 0;
  a1->iClosed = 1;
  return sub_B169C0(a1, a2);
}