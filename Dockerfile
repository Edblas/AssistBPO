FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY AssistBPO-Web/backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY AssistBPO-Web/backend/src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]