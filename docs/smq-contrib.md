---
title: SMQ-Contrib Repository
---


The **SuperMQ-Contrib** repository serves as a collection of additional services, tools, and extensions that complement the SuperMQ platform.
These contributions include features that did not make it into the main SuperMQ platform but are invaluable for specific use cases.
The repository acts as a playground for exploring and testing new ideas and contributions to the ecosystem.

This repository is an excellent starting point for developers looking to contribute new features or experiment with custom services and integrations for SuperMQ.

## Available Services in smq-contrib

### LoRa

The **[LoRa Adapter][lora]** bridges SuperMQ with LoRaWAN networks.
It forwards messages between SuperMQ and a LoRaWAN Server using MQTT while adhering to JSON and SenML formats.
This adapter is ideal for users integrating low-power, wide-area devices into the SuperMQ ecosystem.

- [Learn more about the LoRa Adapter](./lora.md)

---

### OPC-UA

The **[OPC-UA Adapter][opcua]** serves as a bridge between SuperMQ and OPC-UA servers, enabling seamless communication with industrial devices.
It supports browse and subscription methods for retrieving data from nodes on the OPC-UA server and forwards this data to the SuperMQ platform.

- [Learn more about the OPC-UA Adapter](./opcua.md)

---

### Twins Service

The **[Twins Service][twins]** introduces the concept of digital twins to SuperMQ.
Digital twins provide a unified, abstract representation of complex real-world systems.
The Twins Service maintains a history of system states, definitions, and metadata, offering an enhanced way to monitor and manage interconnected devices.

- [Learn more about the Twins Service](./twins.md)

---

### Readers

The **[Readers Service][readers]** is designed to persist SuperMQ messages into various databases, providing robust storage options for IoT data. Currently, the following readers are available:

- **[Cassandra Reader][cassandra]**: Integrates with Apache Cassandra to store and query large volumes of IoT data in a distributed, highly available manner.
- **[InfluxDB Reader][influx]**: Connects with InfluxDB for efficient time-series data storage and real-time queries.
- **[MongoDB Reader][mongodb]**: Leverages MongoDB for storing structured and semi-structured IoT data with powerful query capabilities.

These readers are implemented as independent services, each designed to interface with the respective database while maintaining compatibility with the SuperMQ messaging infrastructure.

- [Learn more about the Readers Service](./messaging.md)

---

### Consumers

**[Consumers][consumers]** work as specialized services that extract messages from the SuperMQ platform and act upon them, helping integrate SuperMQ with broader data-processing workflows.

---

## Contribute to smq-contrib

The **SuperMQ-Contrib** repository is a dynamic and collaborative space for developers. If you have an idea for an additional service or integration, this is the perfect place to start.

- **Add your own contributions**: Developers are encouraged to fork the repository, experiment with ideas, and submit pull requests for review.
- **Collaborate with the community**: Join the discussion and help improve existing contributions.

Visit the [SuperMQ-Contrib GitHub Repository](https://github.com/absmach/smq-contrib) to get started!

## Conclusion

The **SuperMQ-Contrib** repository complements the SuperMQ platform by extending its functionality and fostering innovation. Whether you are a contributor or an end-user, the tools and services in this repository enable you to enhance your IoT infrastructure and explore advanced use cases.

[lora]: https://github.com/absmach/smq-contrib/tree/main/lora
[opcua]: https://github.com/absmach/smq-contrib/tree/main/opcua
[twins]: https://github.com/absmach/smq-contrib/tree/main/twins
[mongodb]: https://github.com/absmach/smq-contrib/tree/main/readers/mongodb
[cassandra]: https://github.com/absmach/smq-contrib/tree/main/readers/cassandra
[influx]: https://github.com/absmach/smq-contrib/tree/main/readers/influxdb
[readers]: https://github.com/absmach/smq-contrib/tree/main/readers
[consumers]: https://github.com/absmach/smq-contrib/tree/main/consumers
