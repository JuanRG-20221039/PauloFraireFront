import React, { Fragment } from 'react';
import Hero from '../components/home/Hero';
import Welcome from '../components/home/Welcome';
import News from '../components/home/News';
import ContactForm from '../components/home/ContactForm';
import DigitalLibrary from '../components/home/DigitalLibrary';
import Galery from '../components/home/Galery';
import History from '../components/home/History';
import Inscripciones from '../components/home/Inscripciones';
import PromotionalVideo from '../components/home/PromotionalVideo';
import DiplomadoInformation from '../components/home/DiplomadoInformation';
import Anniversary from '../components/home/Anniversary';
import Geolocation, { LocationProvider } from '../components/Geolocation';

const Home = () => {
  return (
    <LocationProvider>
      <Fragment>
        <Hero />
        <Inscripciones />
        <Anniversary />
        <PromotionalVideo />
        <DiplomadoInformation />
        <Welcome />
        <News />
        {/* <Galery /> */}
        <History />
        <DigitalLibrary />
        <ContactForm />
        <div className="max-w-[1300px] mx-auto my-10 px-4">
          <Geolocation />
        </div>
      </Fragment>
    </LocationProvider>
  )
}

export default Home