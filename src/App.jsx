import { useEffect, useState } from 'react';
import { ChakraProvider, Box, Heading, Input, InputGroup, InputLeftElement, Text, Button } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import CodeHighlighter from './Components/CodeHighlighter';
import AddNewCodePopover from './Components/AddNewCodePopover.jsx';

const App = () => {
  const [codes, setCodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [codesPerPage] = useState(10);

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const response = await fetch('https://code-box-server.onrender.com/api/codes');
        const data = await response.json();
        setCodes(data);
      } catch (error) {
        console.error('Error fetching codes:', error);
      }
    };

    fetchCodes();
  }, []);

  // Function to add new code
  const handleAddCode = (newCode) => {
    setCodes((prevCodes) => [...prevCodes, newCode]);
  };

  const filteredCodes = codes.filter(code =>
    code.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.slip_no.toString().includes(searchTerm.toLowerCase()) ||
    code.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCode = currentPage * codesPerPage;
  const indexOfFirstCode = indexOfLastCode - codesPerPage;
  const currentCodes = filteredCodes.slice(indexOfFirstCode, indexOfLastCode);
  const totalPages = Math.ceil(filteredCodes.length / codesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to handle deletion
  const handleDelete = (id) => {
    setCodes(codes.filter(code => code.id !== id)); // Update state to remove deleted code
  };

  return (
    <ChakraProvider>
      <Box bg="gray.600" h='100vh' color="white">
        <Box bg="gray.900" w='100%' p='10px' position='sticky' top={0} zIndex={2} display='flex' justifyContent='space-between' alignItems='center'>
          <Box>
            <Heading fontSize="2vw" textAlign="center" style={{ fontFamily: 'Poppins', fontWeight: '600' }}>
              CODE<span style={{ color: 'red' }}><i className="fa-solid fa-code"></i></span>BOX
            </Heading>
          </Box>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Box>
              <InputGroup >
                <InputLeftElement>
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search by question, slip no, or language..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  w='30vw'
                />
              </InputGroup>
            </Box>
            {/* Add New Code Popover */}
            <Box display="flex" justifyContent="end" alignItems='end'>
              <AddNewCodePopover onAddCode={handleAddCode} />
            </Box>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          {currentCodes.length === 0 ? (
            <Text>No codes found.</Text>
          ) : (
            <Box display='flex' justifyContent='space-evenly' alignItems='center' w='100%' h='82vh' overflowY='auto' flexWrap='wrap'>
              {currentCodes.map((code) => (
                <CodeHighlighter
                  key={code.id}
                  id={code.id} // Pass the id to CodeHighlighter
                  codeString={code.code}
                  slipNo={String(code.slip_no)}
                  question={code.question}
                  language={code.language}
                  onDelete={handleDelete} // Pass the handleDelete function
                />
              ))}
            </Box>
          )}

          {/* Pagination controls */}
          <Box mt={4}>
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                colorScheme={currentPage === index + 1 ? 'teal' : 'gray'}
                variant={currentPage === index + 1 ? 'solid' : 'outline'}
                mx={1}
              >
                {index + 1}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default App;
