import React from 'react';
import './MakersGithubPage.css';
import Autocomplete from '../components/autocomplete'

const MakersGithubPage: React.FC = () => {
  return (
    <div className="bg-gray-900 w-full">
      <div id="contact" className="relative z-decoration bg-center bg-no-repeat bg-3d-grid">
        <section className="mx-auto mb-0 flex h-[500px] min-h-fit items-center justify-center md:h-[650px] lg:h-[900px] relative z-contentLayer">
          <Autocomplete></Autocomplete>
        </section>
      </div>
    </div>
  );
};

export default MakersGithubPage;
