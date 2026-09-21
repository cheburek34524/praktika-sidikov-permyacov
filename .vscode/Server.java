import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class Server {

    private static final Path ROOT = Paths.get("public").toAbsolutePath();
    private static final int  PORT = 3000;

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.createContext("/", new StaticHandler());
        server.setExecutor(null);
        server.start();

        System.out.println("==============================================");
        System.out.println("  Сервер расписания запущен");
        System.out.println("  http://localhost:" + PORT);
        System.out.println("  Папка статики: " + ROOT);
        System.out.println("  Остановить: Ctrl + C");
        System.out.println("==============================================");
    }

    static class StaticHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            String urlPath = ex.getRequestURI().getPath();
            if (urlPath.equals("/")) urlPath = "/index.html";

            Path file = ROOT.resolve(urlPath.substring(1)).normalize();

            if (!file.startsWith(ROOT) || !Files.exists(file) || Files.isDirectory(file)) {
                sendText(ex, 404, "Not found: " + urlPath);
                return;
            }

            byte[] data = Files.readAllBytes(file);
            ex.getResponseHeaders().set("Content-Type", contentType(file.toString()));
            ex.getResponseHeaders().set("Cache-Control", "no-cache");
            ex.sendResponseHeaders(200, data.length);
            try (OutputStream os = ex.getResponseBody()) {
                os.write(data);
            }
        }

        private void sendText(HttpExchange ex, int status, String text) throws IOException {
            byte[] data = text.getBytes(StandardCharsets.UTF_8);
            ex.getResponseHeaders().set("Content-Type", "text/plain; charset=utf-8");
            ex.sendResponseHeaders(status, data.length);
            try (OutputStream os = ex.getResponseBody()) {
                os.write(data);
            }
        }

        private String contentType(String name) {
            String n = name.toLowerCase();
            if (n.endsWith(".html") || n.endsWith(".htm")) return "text/html; charset=utf-8";
            if (n.endsWith(".css"))  return "text/css; charset=utf-8";
            if (n.endsWith(".js"))   return "application/javascript; charset=utf-8";
            if (n.endsWith(".json")) return "application/json; charset=utf-8";
            if (n.endsWith(".png"))  return "image/png";
            if (n.endsWith(".jpg") || n.endsWith(".jpeg")) return "image/jpeg";
            if (n.endsWith(".svg"))  return "image/svg+xml";
            if (n.endsWith(".ico"))  return "image/x-icon";
            return "application/octet-stream";
        }
    }
}
