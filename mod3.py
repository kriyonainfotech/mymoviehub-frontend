import os

file_path = "src/components/MovieModal.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# I want to replace the SECOND occurrence of grid-cols-2 md:grid-cols-4, which is in the mobile block.
# Let's split by that string.
parts = content.split('<div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">')

if len(parts) == 3:
    # parts[0] is everything before the FIRST occurrence
    # parts[1] is between FIRST and SECOND occurrence
    # parts[2] is everything after SECOND occurrence
    
    # We want to replace the SECOND occurrence.
    # What does parts[2] start with? It starts with:
    # \n                  {similarMovies.map(sm => ...
    # We need to replace the closing tags too, but actually we can just find where the map ends.
    # Wait, the easiest way is just to replace the class name of the second occurrence!
    # Because inside they are mostly the same, except I changed the div wrapper inside the map!
    
    pass

# Actually, let's just do a direct regex replace for the mobile block using a marker that only exists in the mobile block.
# The mobile block is inside `<div className="block lg:hidden">`

start_idx = content.find('<div className="block lg:hidden">')

old_grid = """<div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
                  {similarMovies.map(sm => (
                    <div key={sm._id} onClick={() => handleMovieChange(sm)} className="bg-[#1a1a1a] rounded-xl overflow-hidden cursor-pointer border border-[#2a2a2a]">
                      <div className="relative aspect-[2/3]">
                        <img src={getDriveDirectLink(sm.driveImageId)} alt={sm.title} className="w-full h-full object-cover" />
                        {sm.durationOrSeasons && (
                          <span className="absolute top-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-yellow-500 flex items-center gap-1">
                            <FaStar size={8} /> {sm.rating || '6.9'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>"""

new_grid = """<div className="flex gap-4 overflow-x-auto scrollbar-hide px-2 pb-2">
                  {similarMovies.map(sm => (
                    <div key={sm._id} onClick={() => handleMovieChange(sm)} className="flex-shrink-0 w-[140px] md:w-[180px] bg-[#1a1a1a] rounded-xl overflow-hidden cursor-pointer border border-[#2a2a2a]">
                      <div className="relative aspect-[2/3]">
                        <img src={getDriveDirectLink(sm.driveImageId)} alt={sm.title} className="w-full h-full object-cover" />
                        {sm.durationOrSeasons && (
                          <span className="absolute top-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-yellow-500 flex items-center gap-1">
                            <FaStar size={8} /> {sm.rating || '6.9'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>"""

# Replace ONLY after start_idx
if start_idx != -1:
    first_part = content[:start_idx]
    second_part = content[start_idx:]
    second_part = second_part.replace(old_grid, new_grid)
    content = first_part + second_part

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done grid")
