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

    private static final int PORT = 3000;

    private static final Path[] ROOTS = {
        Paths.get("public").toAbsolutePath().normalize(),
        Paths.get(".").toAbsolutePath().normalize()
    };

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.createContext("/", new StaticHandler());
        server.setExecutor(null);
        server.start();

        System.out.println("==============================================");
        System.out.println("  Сервер расписания запущен");
        System.out.println("  http://localhost:" + PORT);
        for (Path root : ROOTS) {
            System.out.println("  Ищу файлы в: " + root);
        }
        System.out.println("  Остановить: Ctrl + C");
        System.out.println("==============================================");
    }

    static class StaticHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws IOException {
            String urlPath = ex.getRequestURI().getPath();
            if (urlPath.equals("/")) urlPath = "/index.html";

            String relative = urlPath.substring(1);
            Path file = findFile(relative);

            if (file == null) {
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

        private Path findFile(String relative) {
            for (Path root : ROOTS) {
                Path candidate = root.resolve(relative).normalize();
                if (!candidate.startsWith(root)) continue;
                if (Files.exists(candidate) && !Files.isDirectory(candidate)) {
                    return candidate;
                }
            }
            return null;
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
            if (n.endsWith(".css"))   return "text/css; charset=utf-8";
            if (n.endsWith(".js"))    return "application/javascript; charset=utf-8";
            if (n.endsWith(".json"))  return "application/json; charset=utf-8";
            if (n.endsWith(".png"))   return "image/png";
            if (n.endsWith(".jpg") || n.endsWith(".jpeg")) return "image/jpeg";
            if (n.endsWith(".svg"))   return "image/svg+xml";
            if (n.endsWith(".ico"))   return "image/x-icon";
            if (n.endsWith(".woff"))  return "font/woff";
            if (n.endsWith(".woff2")) return "font/woff2";
            if (n.endsWith(".ttf"))   return "font/ttf";
            return "application/octet-stream";
        }
    }
}