const fs = require('fs');
let code = fs.readFileSync('src/components/Row.jsx', 'utf8');
code = code.replace(import React, { useState } from 'react';, import React, { useState } from 'react';\nimport { useNavigate } from 'react-router-dom';);
code = code.replace(const Row = ({ title, isLargeRow, movies }) => {, const Row = ({ title, isLargeRow, movies }) => {\n  const navigate = useNavigate(););
code = code.replace(/setSelectedMovie\(movie\)/g, "navigate('/movie/' + movie._id)");
fs.writeFileSync('src/components/Row.jsx', code);
