char *Blaze::Redirector::ServerInstanceRequest::getBlazeSDKVersion
{
  if ( !Blaze::Server::BlazeSDKVersion )
    blaze_snzprintf(&Blaze::Server::BlazeSDKVersion, 0x100u, "%u.%u.%u.%u%s", 3);
  return &Blaze::Server::BlazeSDKVersion;
}