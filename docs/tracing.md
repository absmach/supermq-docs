# Tracing

Distributed tracing is a method of profiling and monitoring applications. It can provide valuable insight when optimizing and debugging an application. Magistrala includes the [Jaeger][jaegertracing] open tracing framework as a service with its stack by default.

## Launch

The Jaeger service will launch with the rest of the Magistrala services. All services can be launched using:

```bash
make run
```

The Jaeger UI can then be accessed at `http://localhost:16686` from a browser. Details about the UI can be found in [Jaeger's official documentation][jaeger-ui].

## Configure

The Jaeger service can be disabled by using the `scale` flag with `docker-compose up` and setting the jaeger container to 0.

```bash
--scale jaeger=0
```

Jaeger uses 5 ports within the Magistrala framework. These ports can be edited in the `.env` file.

| Variable            | Description                                       | Default     |
| ------------------- | ------------------------------------------------- | ----------- |
| MG_JAEGER_PORT      | Agent port for compact jaeger.thrift protocol     | 6831        |
| MG_JAEGER_FRONTEND  | UI port                                           | 16686       |
| MG_JAEGER_COLLECTOR | Collector for jaeger.thrift directly from clients | 14268       |
| MG_JAEGER_CONFIGS   | Configuration server                              | 5778        |
| MG_JAEGER_URL       | Jaeger access from within Magistrala              | jaeger:6831 |

## Message Tracing

Magistrala provides for tracing of messages ingested into the Magistrala platform. The message metadata such as topic, sub-topic, subscriber and publisher is also included in traces. ![HTTP Message Publishing trace][message-trace].

The messages are tracked from end to end from the point they are published to the consumers where they are stored. ![Influx DB consumer trace][consumer-trace]

## Example

As an example for using Jaeger, we can look at the traces generated after provisioning the system. Make sure to have ran the provisioning script that is part of the [Getting Started][getting-started] step.

Before getting started with Jaeger, there are a few terms that are important to define. A `trace` can be thought of as one transaction within the system. A trace is made up of one or more `spans`. These are the individual steps that must be taken for a trace to perform its action. A span has `tags` and `logs` associated with it. Tags are key-value pairs that provide information such as a database type or http method. Tags are useful when filtering traces in the Jaeger UI. Logs are structured messages used at specific points in the trace's transaction. These are typically used to indicate an error.

When first navigating to the Jaeger UI, it will present a search page with an empty results section. There are multiple fields to search from including service, operation, tags and time frames. Clicking `Find Traces` will fill the results section with traces containing the selected fields.

![Search page with results][search]

The top of the results page includes a scatter plot of the traces and their durations. This can be very useful for finding a trace with a prolonged runtime. Clicking on one of the points will open the trace page of that trace.

Below the graph is a list of all the traces with a summary of its information. Each trace shows a unique identifier, the overall runtime, the spans it is composed of and when it was ran. Clicking on one of the traces will open the trace page of that trace.

![Trace page with expanded spans][trace]

The trace page provides a more detailed breakdown of the individual span calls. The top of the page shows a chart breaking down what spans the trace is spending its time in. Below the chart are the individual spans and their details. Expanding the spans shows any tags associated with that span and process information. This is also where any errors or logs seen while running the span will be reported.

This is just a brief overview of the possibilities of Jaeger and its UI. For more information, check out [Jaeger's official documentation][jaeger-ui].

[jaegertracing]: https://www.jaegertracing.io/
[jaeger-ui]: https://www.jaegertracing.io/docs/1.14/frontend-ui/
[message-trace]: img/tracing/messagePub.png
[consumer-trace]: https://user-images.githubusercontent.com/44265300/241806789-a56f368c-a89f-4b5d-88fe-25b971ca4718.png
[getting-started]: /getting-started/
[search]: img/tracing/search.png
[trace]: img/tracing/trace.png
