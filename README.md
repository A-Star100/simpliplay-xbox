# simpliplay-xbox
UWP app for Xbox, built on a Windows VM. This version does not properly support HLS and MPEG-DASH as of now, and is mostly stale other than necessary updates that prevent the app from breaking.
[Get from Microsoft Store (Xbox only)](https://apps.microsoft.com/detail/9PN7LMPJFRW1)

> [!WARNING]
> SimpliPlay is no longer supported on Xbox. It is available on the Microsoft Store, but will not receive any more updates than needed. Source will be updated accordingly
> I found a source build in archives, and used that for submission. And it worked.

## Use as a template
The port can be used as a template (the license is neat) for a basic WebView1 app.
If you don't have VS Studio with the UWP toolkit installed, you can just download a production APPX (the latest one to avoid any weird issues)
then rename its extension to a `.zip` and extract it.
From there in the "WebAssets" folder, put any web code you have in (HTML, CSS, etc).
Then you can compress the folder as a ZIP and rename it to `.appx`.
Note that the Microsoft Partner Center **REQUIRES PACKAGES TO BE SELF-SIGNED**, even
if it's just for an upload before certification or something like that.
If you lack a Windows machine at all, you can use GitHub Actions or some other CI
to take your APPX and sign it and spit out the new version. Even if your signer says "Unknown Error"
still try uploading it (it worked for me).

## OLD instructions (optional because the app is signed now)
## How to sign the app (required or otherwise it won't install even in Dev Mode)

### 1. Create a Self-Signed Certificate

Open **PowerShell as Administrator** and run:

```powershell
$cert = New-SelfSignedCertificate -Type Custom -Subject "CN=TestMSIXCert" -KeyUsage DigitalSignature -FriendlyName "Test MSIX Cert" -CertStoreLocation "Cert:\CurrentUser\My" -KeyAlgorithm RSA -KeyLength 2048 -HashAlgorithm SHA256
```

This creates a new certificate in your CurrentUser personal certificate store.

### 2. Export the Public Certificate (.cer)
Run this in PowerShell to export the public certificate to your Desktop:

```powershell
Export-Certificate -Cert $cert -FilePath "$env:USERPROFILE\Desktop\TestMSIXCert.cer"
```
You will use this .cer file to install/trust the certificate on the test device.

### 3. Export the Private Key Certificate (.pfx) for Signing
Open `certmgr.msc` (Certificates Manager).

Navigate to Personal > Certificates.

Find Test MSIX Cert (or the name you chose).

Right-click the certificate → All Tasks → Export.

Choose Yes, export the private key.

Select .pfx format.

Set a password when prompted.

Save the .pfx file somewhere safe (e.g., C:\path\to\TestMSIXCert.pfx).

### 4. Sign Your MSIX Package Using signtool
Make sure you have SignTool installed (comes with Windows SDK). Then run this in PowerShell or Command Prompt:

```powershell
signtool sign /fd SHA256 /f "C:\path\to\TestMSIXCert.pfx" /p "yourPFXpassword" /v "C:\path\to\your.msix"
```
Replace "yourPFXpassword" and paths with your actual values.

### 5. Install the Certificate on Your Test Device
- On Xbox (Developer Mode):

Use the Device Portal to upload and install the .cer file.

- On Windows:

Double-click the exported .cer file.

Click Install Certificate.

Choose Local Machine or Current User (depending on your use case).

Install to Trusted Root Certification Authorities.

### 6. Test Installing the Signed MSIX Package
Now that the MSIX package is signed and the certificate trusted on the device, you should be able to install and run your app without signature errors.

Additional Notes
This method is for testing and development only.
