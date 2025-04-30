const Loader = () => {
    return (
      <>
        <div id="loader" className="d-flex justify-content-center align-items-center vh-100">
          <div className="my-loader">
            <div className="rubiks-cube">
              {['front', 'back', 'left', 'right', 'top', 'bottom'].map((face) => (
                <div className={`face ${face}`} key={face}>
                  {[...Array(9)].map((_, i) => (
                    <div className="cube" key={i} style={{ background: getColor(face, i) }}></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Include the styles directly here (or use a CSS module or external file) */}
        <style jsx>{`
          .my-loader {
            width: 200px;
            height: 200px;
            perspective: 1000px;
            margin: auto;
          }
          .rubiks-cube {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            animation: my-rotateCube 5s infinite linear;
          }
          .face {
            position: absolute;
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            height: 100%;
          }
          .face.front {
            transform: translateZ(100px);
          }
          .face.back {
            transform: rotateY(180deg) translateZ(100px);
          }
          .face.left {
            transform: rotateY(-90deg) translateZ(100px);
          }
          .face.right {
            transform: rotateY(90deg) translateZ(100px);
          }
          .face.top {
            transform: rotateX(90deg) translateZ(100px);
          }
          .face.bottom {
            transform: rotateX(-90deg) translateZ(100px);
          }
          .cube {
            width: calc(100% / 3);
            height: calc(100% / 3);
            box-sizing: border-box;
            border: 1px solid #000;
          }
          @keyframes my-rotateCube {
            0% {
              transform: rotateX(0deg) rotateY(0deg);
            }
            100% {
              transform: rotateX(360deg) rotateY(360deg);
            }
          }
        `}</style>
      </>
    );
  };
  
  // Utility function to return color pattern
  const getColor = (face: string, i: number): string => {
    const colors: Record<string, string[]> = {
      front: ['#ff3d00', '#ffeb3b', '#4caf50', '#2196f3', '#ffffff', '#ffeb3b', '#4caf50', '#2196f3', '#ff3d00'],
      back: ['#4caf50', '#ff3d00', '#ffeb3b', '#2196f3', '#ffffff', '#ff3d00', '#ffeb3b', '#4caf50', '#2196f3'],
      left: ['#ffeb3b', '#4caf50', '#2196f3', '#ff3d00', '#ffffff', '#4caf50', '#2196f3', '#ffeb3b', '#ff3d00'],
      right: ['#4caf50', '#ff3d00', '#ffeb3b', '#2196f3', '#ffffff', '#ff3d00', '#ffeb3b', '#4caf50', '#2196f3'],
      top: ['#2196f3', '#ffeb3b', '#ff3d00', '#4caf50', '#ffffff', '#ffeb3b', '#ff3d00', '#4caf50', '#2196f3'],
      bottom: ['#ffffff', '#4caf50', '#2196f3', '#ff3d00', '#ffeb3b', '#4caf50', '#2196f3', '#ffffff', '#ff3d00']
    };
    return colors[face][i] || '#000';
  };
  
  export default Loader;
  