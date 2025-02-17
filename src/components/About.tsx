import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="p-4">
      <h1 className="text-center mb-4">O Mountain trails</h1>
      
      <section className="mb-4">
        <h3>Czym jest Mountain trails?</h3>
        <p>
          Mountain Trails to aplikacja internetowa, która została stworzona w celach rozrywkowych. 
          Blisko 20 tysięcy szczytów górskich na terenie Polski i w pobliżu granic jest dostępnych na mapie.
          Użytkownicy mogą odznaczać zdobyte szczyty. Na niektóre szczyty nie ma bezpośredniego podejścia (drogą, szlakiem), więc zachowaj roztropność.
          Zdobywając szczyty pasek postępu będzie przybierać na wartości co da orientację ile już się zwiedziło.
        </p>
      </section>
      
      <section className="mb-4">
        <h3>Funkcje</h3>
        <ul>
          <li>Znajduj szczyty na mapie</li>
          <li>Śledź postęp w zdobywaniu szczytów</li>
          <li>Sprawdzaj statystyki innych osób</li>    
          <li>Dodawaj zdjęcia z wycieczek</li>      
        </ul>
      </section>

      <section className="mb-4">
        <h3>Jak zacząć przygodę</h3>
        <p>
          Aby móc odznaczać szczyty należy założyć <Link to="/register">konto</Link>. 
        </p>
      </section>
    </div>
  );
};

export default About;
