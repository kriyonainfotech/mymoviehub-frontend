const fs = require('fs');
let code = fs.readFileSync('src/pages/Movies.jsx', 'utf8');

const oldLoop = \          return (
            <Row 
              key={category._id} 
              title={category.name} 
              isLargeRow={category.isLargeRow}
              movies={categoryMovies} 
            />
          );\;

const newLoop = \          return (
            <div key={category._id}>
              <Row 
                title={category.name} 
                isLargeRow={category.isLargeRow}
                movies={categoryMovies} 
              />
              {(index === 1 || index === 4 || index === 7) && (
                <div className="w-full flex justify-center py-4 my-2">
                  <div className="hidden md:block">
                    <AdsterraAd width={728} height={90} adKey="3e52a7de4f64eb578996bc017ab9863c" />
                  </div>
                  <div className="md:hidden">
                    <AdsterraAd width={320} height={50} adKey="b06804870a5a3c679877784e41216b13" />
                  </div>
                </div>
              )}
            </div>
          );\;

code = code.replace(oldLoop, newLoop);
fs.writeFileSync('src/pages/Movies.jsx', code);
