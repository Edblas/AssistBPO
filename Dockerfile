# DEBUG DOCKERFILE - FORCE DATA COPY
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# DEBUG: Mostre o que tem
RUN echo "=== LISTANDO ESTRUTURA ==="
RUN find /app -type f -name "*.json" | head -10
RUN ls -la /app

COPY AssistBPO-Web/backend/pom.xml .
RUN mvn dependency:go-offline -B

# DEBUG ANTES de copiar
RUN echo "=== ANTES DE COPIAR DATA ==="
RUN ls -la /app/AssistBPO-Web/backend/ 2>/dev/null || echo "Pasta não existe"

COPY AssistBPO-Web/backend/src ./src
COPY AssistBPO-Web/backend/data ./data

# DEBUG DEPOIS de copiar
RUN echo "=== DEPOIS DE COPIAR DATA ==="
RUN ls -la /app/data/ 2>/dev/null || echo "Data não copiado"
RUN find /app/data -type f | head -5

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
COPY --from=build /app/data ./data

# DEBUG FINAL
RUN echo "=== CONTEÚDO FINAL /app ==="
RUN ls -la /app

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]