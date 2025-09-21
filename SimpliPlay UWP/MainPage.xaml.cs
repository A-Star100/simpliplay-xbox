using System;
using Windows.UI.Xaml.Controls;

namespace SimpliPlay
{
    public sealed partial class MainPage : Page
    {
        public MainPage()
        {
            this.InitializeComponent();
            MyWebView.NavigationFailed += MyWebView_NavigationFailed;
            LoadLocalHtml();
        }

        private void LoadLocalHtml()
        {
            // The correct URI for local content is a hardcoded, relative path.
            // The ms-appx-web:// protocol automatically looks inside your app package.
            // The path should be relative to the package root.
            var uri = new Uri("ms-appx-web:///WebAssets/index.html");

            // Load the HTML file into the WebView
            MyWebView.Navigate(uri);
        }

        private async void MyWebView_NavigationFailed(object sender, WebViewNavigationFailedEventArgs e)
        {
            ContentDialog dialog = new ContentDialog
            {
                Title = "Navigation Failed",
                Content = $"Failed to load content. Error: {e.WebErrorStatus}",
                CloseButtonText = "OK"
            };

            await dialog.ShowAsync();
        }
    }
}
