import { useRef, useState, useEffect } from "react";
import { Map } from "react-map-gl/maplibre";
import { useGeolocation } from "../hooks/useGeolocation";
import useViewport from "../hooks/useViewport";
import Spinner from "../components/spinner/Spinner";
import Input from "../components/form/Input";
import Button from "../components/form/Button";

function Search() {
    const mapRef = useRef(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const { userLocation } = useGeolocation();
    const { isMobile } = useViewport();

    const [formData, setFormData] = useState({
        address: '',
        date: '',
        duration: '60', // 1 heure par défaut
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Recherche avec:', formData);
        // TODO: Implémenter la logique de recherche des stations
    };

    const handleMapMovement = (event) => {
        // Gérer les mouvements de la carte si nécessaire
    };

    // Si la géolocalisation n'est pas encore disponible, afficher le spinner
    if (!userLocation) {
        return <main className="hero-fullscreen-height"><Spinner /></main>;
    }

    return (
        <main className="search-page d-flex hero-fullscreen-height">
            <div className="stations d-flex flex-column align-items-center" style={{width: "50%"}}>
                <div 
                    className="search-form-container w-100 p-4 pb-0 mb-4" 
                    style={{backgroundColor: '#ffffff', position: 'sticky', top: 'var(--header-height)'}}
                >
                    <form 
                        className="search-form p-4 w-100 d-flex gap-3 align-items-end justify-content-between border rounded" 
                        style={{backgroundColor: '#f8f9fa', zIndex: 10, width: 'calc(100% - 32px)'}}
                        onSubmit={handleSubmit}
                    >
                        <Input
                            id="search-address"
                            name="address"
                            type="text"
                            label="📍 Adresse ou ville" 
                            placeholder="Ex: Paris, Lyon, Marseille..."
                            value={formData.address}
                            onChange={handleInputChange}
                            wrapperClassName=""
                            style={{minWidth: '300px'}}
                            required
                        />
                        <Input
                            id="search-date"
                            name="date"
                            type="datetime-local"
                            label="📅 Date"
                            value={formData.date}
                            onChange={handleInputChange}
                            wrapperClassName=""
                            required
                        />
                        <Input
                            id="search-duration"
                            name="duration"
                            type="select"
                            label="⏱️ Durée"
                            options={[
                                { value: '30', label: '30 minutes' },
                                { value: '60', label: '1 heure' },
                                { value: '120', label: '2 heures' },
                                { value: '240', label: '4 heures' },
                                { value: '480', label: '8 heures' },
                            ]}
                            value={formData.duration}
                            onChange={handleInputChange}
                            wrapperClassName=""
                            required
                        />
                        <Button type="submit" style={{minWidth: '140px'}}>🔍 Rechercher</Button>
                    </form>
                </div>
                <div className="stations-list w-100 px-4">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus modi hic veritatis quod labore maiores voluptas itaque eius fuga tenetur tempora, voluptatem at ea exercitationem esse illo soluta? Voluptatibus, numquam.
                    Omnis deserunt ipsum voluptas a nobis tenetur magnam architecto corrupti quam quasi, incidunt dolores harum, voluptatibus, nostrum necessitatibus sunt quidem ducimus! Nemo deserunt soluta mollitia praesentium, id suscipit omnis perspiciatis!
                    Quia ea odio animi repellat temporibus eum fuga, voluptas voluptatum voluptatibus asperiores officia quasi, rerum doloremque facere repellendus nam soluta corrupti esse tempora, tempore praesentium ipsum! Perspiciatis illum temporibus consequuntur.
                    Harum dolore quos voluptate. Tempore aut modi error rem expedita quidem, laborum repellendus neque obcaecati odio eos quam nobis libero adipisci at ad harum nesciunt ipsa? Aut, voluptatum corrupti. Minus.
                    Voluptatibus in culpa consequuntur quidem est quaerat sit ex, inventore eveniet molestias quasi temporibus id, blanditiis dicta aliquam adipisci perspiciatis et laudantium maiores nulla commodi nihil! Fugiat labore cumque iusto?
                    Libero molestias veritatis expedita corporis laudantium sequi iste quae obcaecati, est reprehenderit commodi mollitia ut, quas id facilis numquam nulla. Fugiat ducimus autem itaque a quisquam voluptatibus perferendis alias reprehenderit.
                    Dolorem eveniet, laboriosam est at nisi corrupti expedita? Quod soluta debitis suscipit animi. Consequatur repellat dicta, neque modi minus totam nam quas velit tenetur dolorem quam, quae, tempore sit necessitatibus!
                    Blanditiis veritatis autem inventore, doloribus facere odit fugit? Dolores voluptatem earum repellendus, eum voluptates repellat ut corrupti cumque velit culpa quisquam in est obcaecati. Cumque minus rem asperiores deserunt nam.
                    Inventore error impedit quo porro eum dicta placeat sit recusandae rerum velit cumque voluptates, possimus adipisci delectus esse, assumenda repudiandae perspiciatis aliquam voluptas. Saepe ad tenetur, amet culpa maxime aspernatur.
                    Inventore id voluptatem omnis libero sapiente porro, perspiciatis maxime aspernatur voluptatum similique quas ut est ipsum voluptatibus ipsa excepturi quos. Alias vitae explicabo eius quidem ullam facilis molestiae autem cum.
                    Perspiciatis magni, inventore exercitationem voluptate aut doloribus aspernatur cum, fugiat nemo tenetur, incidunt necessitatibus vero facilis voluptatem. Corrupti omnis similique nesciunt tempore voluptatibus neque id eum quidem! Illum, deleniti vitae.
                    Commodi odit laborum distinctio dolorum, numquam dolorem voluptate, debitis tenetur cumque nobis, minima enim esse deserunt quo provident fugit ea dolores a officia aut qui ullam consequuntur. Est, delectus dolorum?
                    Fugit iusto, eveniet placeat non iste facilis ratione accusamus quam in dolores vel modi quaerat beatae, debitis consectetur aut dicta eligendi nemo a nam? Vel magni incidunt soluta possimus neque!
                    Adipisci, atque optio. Fugit saepe adipisci unde. Accusamus odio assumenda laboriosam ab voluptate quasi quae optio sit ipsum corporis in, laborum quas voluptas rerum provident. Ratione cumque nulla corrupti exercitationem.
                    Beatae quidem ipsa explicabo placeat officiis ducimus doloribus, eveniet aliquid repudiandae soluta praesentium, quia hic. Beatae quae qui ipsam, sunt vitae sequi quas libero facilis incidunt. Eum similique corrupti repellat?
                    Dolorum, iste asperiores. Voluptates adipisci vitae deserunt totam quo dolor ducimus? Quo hic aut quod commodi autem nam ipsa fugit? Eligendi architecto asperiores repellendus consectetur vel temporibus. Distinctio, laudantium totam?
                    Laborum laboriosam dolorem porro nobis ipsam quibusdam, assumenda nam, delectus optio error alias cumque quae repudiandae deleniti culpa veniam molestiae quam placeat! Illo quia minus necessitatibus quisquam, velit amet corporis.
                    Modi obcaecati ipsum cupiditate, accusantium iusto totam velit placeat id quasi aspernatur, rem eveniet incidunt ducimus voluptatem voluptatum nobis vel eos omnis eaque illo est suscipit laboriosam. Nam, sed nulla.
                    Consectetur minima tenetur nam nihil perspiciatis ducimus, quas reiciendis totam, amet magni autem nulla necessitatibus fugit eligendi pariatur, nostrum harum adipisci culpa aperiam voluptates facere quasi suscipit doloribus. Harum, molestiae?
                    Quia, suscipit nam deleniti eos dolore consequuntur cupiditate vitae. Nihil possimus voluptatum earum, et dignissimos laboriosam ipsam commodi rem tempore delectus numquam eius fugiat enim architecto temporibus, omnis illo nam.
                    Dolorem officiis nemo autem cum consequuntur nesciunt ipsam! Magnam laboriosam provident repellendus earum, illo ducimus corporis dolor explicabo veritatis eaque. Eius nesciunt facere laboriosam numquam esse fugit est exercitationem quisquam?
                    Porro voluptatem officia deserunt alias ut odio eveniet magni fugiat cumque, unde nulla consectetur ex maxime repellat mollitia iste tempora vitae odit aut vel provident, ducimus quis eum numquam. Autem?
                    Aut ea sunt temporibus eaque, recusandae ratione nam alias quod corrupti non voluptatem sint quas ipsa minus deserunt. Officiis, earum assumenda? Illo doloremque dolores beatae ullam quod atque quis! Ut.
                    Atque nisi, culpa reiciendis, a quibusdam corporis velit doloremque facilis ratione, reprehenderit deleniti quae officia quo magni temporibus nulla fugiat quos eius eos est. Vero aliquid nisi odio corporis! Provident.
                    Inventore eligendi numquam ratione fuga commodi nobis nisi, sapiente eum facilis omnis voluptatibus illum mollitia ullam aut facere ut officia, molestias culpa praesentium vero. Velit inventore cum ex hic adipisci!
                    Dolorem molestias exercitationem culpa totam repellendus fugit itaque similique provident velit maiores quae nulla mollitia et minus eius temporibus eaque voluptates aliquid dolorum, quos laboriosam. Quisquam iure necessitatibus consequuntur fuga?
                    Repudiandae, corporis? Possimus itaque earum fuga sunt veritatis delectus at quos eum quas, aperiam placeat. Debitis, veniam. Voluptatibus iusto unde labore in? Laudantium harum repellendus, ducimus tempore nemo blanditiis doloremque?
                    Eius quae numquam voluptates quas fugit ab assumenda magnam veritatis sint quod id, error, nobis harum, culpa libero. Pariatur sed repellat aspernatur obcaecati harum aut neque fuga fugiat nostrum temporibus!
                    Doloribus, praesentium eum. Laudantium, iste? Enim delectus temporibus modi itaque eum nihil ut, impedit laborum voluptatibus id quae at consectetur obcaecati libero est aut nemo voluptate voluptas, vero iusto. Veniam.
                    Ad iure ratione dignissimos repudiandae. Illum harum consectetur incidunt minima vitae qui, ullam accusantium cumque ea delectus tenetur quo reprehenderit, voluptates laudantium officiis quod reiciendis possimus voluptas dolorem veniam dolores.
                </div>
            </div>
            <div 
                className="map-container hero-fullscreen-strict-height py-4 pe-4" 
                style={{width: "50%", position: 'sticky', top: 'var(--header-height)'}}
            >
                <div className="border rounded-3 h-100 position-relative" style={{overflow: 'hidden'}}>
                    <Map
                        ref={mapRef}
                        id="search-map"
                        initialViewState={userLocation}
                        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=x8wLPu6vQFH77llyCUjo"
                        scrollZoom={isMobile ? false : false}
                        touchZoomRotate={isMobile ? true : false}
                        touchPitch={isMobile ? true : false}
                        doubleClickZoom={true}
                        minZoom={7}
                        maxZoom={22}
                        onMove={handleMapMovement}
                        onZoom={handleMapMovement}
                        onLoad={() => setIsMapLoaded(true)}
                    >
                    </Map>
                </div>
               
                
            </div>
        </main>
    );
}

export default Search;