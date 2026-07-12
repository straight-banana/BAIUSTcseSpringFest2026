import { Search } from 'lucide-react';
import Input from './Input.jsx';

export default function SearchInput(props) {
  return <Input leftIcon={<Search size={14} />} placeholder="Search..." {...props} />;
}
