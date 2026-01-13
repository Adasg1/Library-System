FROM openjdk:25-ea-jdk-bookworm AS build

WORKDIR /app
COPY . .

RUN chmod +x gradlew

RUN ./gradlew bootJar -x test

FROM openjdk:25-ea-jdk-bookworm

WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]