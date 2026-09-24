import UIKit
import WebKit

class ViewController: UIViewController, WKNavigationDelegate, WKUIDelegate {

    var webView: WKWebView!

    override func loadView() {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        if #available(iOS 10.0, *) {
            config.mediaTypesRequiringUserActionForPlayback = []
        }
        // Allow JS to run fully
        let prefs = WKPreferences()
        prefs.javaScriptCanOpenWindowsAutomatically = true
        config.preferences = prefs

        webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.scrollView.bounces = false
        webView.isOpaque = false
        webView.backgroundColor = UIColor.black
        view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        // Load index.html from WebAssets bundle
        guard let htmlPath = Bundle.main.path(forResource: "index", ofType: "html", inDirectory: "WebAssets"),
              let url = URL(string: "file://\(htmlPath)") else {
            // Fallback
            let html = "<html><body style='background:black;color:white;display:flex;align-items:center;justify-content:center;height:100vh;font-size:24px'><div>HyperAimLock</div></body></html>"
            webView.loadHTMLString(html, baseURL: nil)
            return
        }

        let baseURL = url.deletingLastPathComponent()
        webView.loadFileURL(url, allowingReadAccessTo: baseURL)
    }

    // Hide status bar
    override var prefersStatusBarHidden: Bool { return true }
    override var prefersHomeIndicatorAutoHidden: Bool { return true }

    // WKUIDelegate - allow alert(), confirm(), prompt()
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String,
                 initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler() })
        present(alert, animated: true)
    }
}
