pushd  "%~dp0"
rmdir "Tests\links"
mklink /D "Tests\links" "..\LinqTS"