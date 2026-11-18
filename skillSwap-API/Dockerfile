# ---- Build ---------------------------------------------------------------
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /build

# Resolve dependencies first so they are cached between code changes
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

COPY src ./src
RUN mvn -B -q -DskipTests package

# ---- Run -----------------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app
COPY --from=build /build/target/skillswap-api.jar app.jar
USER app

# Size the heap from the container memory limit and use the low-footprint collector
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=70 -XX:+UseSerialGC -Xss512k"

EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=3s --start-period=60s --retries=5 \
  CMD wget -qO- http://localhost:8080/actuator/health | grep -q '"UP"' || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
