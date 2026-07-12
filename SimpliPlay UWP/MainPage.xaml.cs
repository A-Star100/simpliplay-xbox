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
            // the paths used are in the root of the project
            // ms-appx-web:// uri is specific to webpages
            // whereas ms-appx:// is a general uri for it
            var uri = new Uri("ms-appx-web:///WebAssets/index.html");

            // go to html page
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
