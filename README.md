# MultiOn & Wordware Tool Integration for Next.js & OpenAI

Welcome to the **Universal AI Playground** - the ultimate platform for harnessing the power of artificial intelligence to tackle real-world challenges. This innovative tool empowers users to create interoperable chains of intelligent agents and specialized tools, unlocking unprecedented capabilities.

## Tech Stack

- **Vercel**
- **Next.js** (using the new /app scheme with Typescript routes)

## Tool Call Examples

### Wordware Integration

**Tool call examples to use with ERAC to call API endpoints that answer questions like Wordware**

#### /wordware/ Tool Call

```json
{
  "model": "text-davinci-003",
  "prompt": "Answer the following question using Wordware: [Your Question Here]",
  "max_tokens": 150,
  "n": 1,
  "stop": ["\n"],
  "temperature": 0.7
}
```

### MultiOn Integration

**MultiOn is built into ERAC, and here are the tool calls and the route.ts files for each API endpoint**

#### /multion/ Tool Call for Scrape

```json
{
  "model": "text-davinci-003",
  "prompt": "Use MultiOn Scrape to gather information from the following URL: [Your URL Here]",
  "max_tokens": 150,
  "n": 1,
  "stop": ["\n"],
  "temperature": 0.7
}
```

#### /multion/ Tool Call for Browse

```json
{
  "model": "text-davinci-003",
  "prompt": "Use MultiOn Browse to navigate and gather information from the following website: [Your Website Here]",
  "max_tokens": 150,
  "n": 1,
  "stop": ["\n"],
  "temperature": 0.7
}
```

## Live Demo

You can use the **LIVE Free version** here: [Universal AI Playground](https://myriadai.online). Note that the free version is limited, but a **PRO version** is coming soon.

## Tool Configurations and Deployment

- Tool configurations and code to deploy MultiOn Browse and Scrape
- All 4 Wordware Templates Demo

## Introducing the Universal AI Playground

The Universal AI Playground provides a flexible, modular environment where you can mix and match AI components, experiment with new configurations, and watch as your ideas come to life. Whether you're a seasoned developer, a domain expert, or a curious tinkerer, this playground puts the future of AI in your hands. Unlock new possibilities and revolutionize the way you approach problem-solving today.

## Contributing

We welcome contributions from the community! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push the branch to your fork.
4. Open a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Thank you for checking out the **Universal AI Playground**! We hope you enjoy exploring and creating with it. If you have any questions or need further assistance, feel free to open an issue on GitHub. Happy innovating!

Introducing the Universal AI Playground - the ultimate platform for harnessing the power of artificial intelligence to tackle real-world challenges. This innovative tool empowers users to create interoperable chains of intelligent agents and specialized tools, unlocking unprecedented capabilities. Imagine seamlessly integrating natural language processing, computer vision, robotic control, and predictive analytics to automate complex workflows or devise novel solutions. The Universal AI Playground provides a flexible, modular environment where you can mix and match AI components, experiment with new configurations, and watch as your ideas come to life. Whether you're a seasoned developer, a domain expert, or a curious tinkerer, this playground puts the future of AI in your hands. Unlock new possibilities and revolutionize the way you approach problem-solving today.

<img src="banner.png" alt="Hackathon">


