int __cdecl ProtoSSLDisconnect(ProtoSSLRefT *a1)
{
  ResetState(a1, a1[1].pSock != 0);
  return 0;
}