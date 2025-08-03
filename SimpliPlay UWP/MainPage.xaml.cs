using System;
using Windows.Storage;
using Windows.UI.Xaml.Controls;
using Windows.ApplicationModel;
using System.Threading.Tasks;

namespace SimpliPlay
{
    public sealed partial class MainPage : Page
    {
        public MainPage()
        {
            this.InitializeComponent();
            LoadLocalHtml();
        }

        private async void LoadLocalHtml()
        {
            // Get the installed location of the app
            var folder = Package.Current.InstalledLocation;

            // Ensure you have the correct path to the index.html file
            var file = await folder.GetFileAsync(@"WebAssets\index.html");

            // Correctly form the URI to point to the local HTML file
            var uri = new Uri($"ms-appx-web:///{file.Path.Replace('\\', '/')}");

            // Load the HTML file into the WebView
            MyWebView.Navigate(uri);
        }
    }
}
