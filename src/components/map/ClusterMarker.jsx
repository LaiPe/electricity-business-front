import { Marker } from 'react-map-gl/maplibre';

/**
 * Composant pour afficher un marqueur de cluster
 */
function ClusterMarker({ cluster, onClusterClick }) {
    return (
        <Marker
            key={cluster.id}
            longitude={cluster.longitude}
            latitude={cluster.latitude}
            anchor="bottom"
            onClick={(e) => {
                e.originalEvent.stopPropagation();
                onClusterClick(cluster);
            }}
        >
            <div 
                className="cluster-marker"
                style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#007bff',
                    borderRadius: '50%',
                    border: '3px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'white'
                }}
                title={`${cluster.count} stations dans cette zone`}
            >
                {cluster.count}
            </div>
        </Marker>
    );
}

export default ClusterMarker;