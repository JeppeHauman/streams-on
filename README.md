# Streams-on

## Overview
Streams-on is a web application designed to help users find streaming platforms where their favorite movies are available. With Streams-on, users can easily search for a movie and discover which streaming service offers it, customized to their preferred country. This project utilizes the themoviedb API to gather movie information and presents it in a user-friendly interface.

## Features
- **Search Functionality**: Users can search for movies by title.
- **Streaming Platform Information**: Streams-on displays information on which streaming platforms offer the searched movie.
- **Country Selection**: Users can specify the country they want to search for, ensuring accurate streaming platform availability information.
- **Responsive Design**: Built with Astro as the meta framework and qwik components, Streams-on offers a responsive and interactive user experience across devices.

## Getting Started
To get started with Streams-on, follow these steps:
1. Clone the repository to your local machine.
2. Install dependencies using your preferred package manager.
3. Obtain an API key from themoviedb API.
4. Create a `.env` file in the project root and add your API key:
   ```
   PUBLIC_TMDB_AUTH=your_api_key_here
   ```
5. Run the application locally using the appropriate command for your package manager.

## Technologies Used
- **Astro**: An all-in-one web framework.
- **Qwik**: Javascript web framework focusing resumability instead of hydration.
- **themoviedb API**: Provides movie information for the application.
- **HTML, CSS, JavaScript**: Core technologies for web development.

## Contributors
- [Nima](https://github.com/n13a)
- [Jeppe](https://github.com/jeppehauman)

## Contributing
We welcome contributions from the community. If you'd like to contribute to Streams-on, please fork the repository, make your changes, and submit a pull request. Be sure to follow our [code of conduct](CODE_OF_CONDUCT.md) and [contribution guidelines](CONTRIBUTING.md).

## License
This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as per the terms of the license.
