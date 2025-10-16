import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import type { PaginatorPageChangeEvent } from 'primereact/paginator';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { artworkService } from '../services/api';
import type { Artwork, SelectedRows } from '../types';
import { FaChevronDown } from 'react-icons/fa';

const DataTableComponent: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedRows, setSelectedRows] = useState<SelectedRows>({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);


  const toast = useRef<Toast>(null);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await artworkService.getArtworks(page + 1, rowsPerPage);
      setArtworks(response.data);
      setFilteredArtworks(response.data);
      setTotalRecords(response.pagination.total);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch artworks',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, []);

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setCurrentPage(event.page);
    fetchData(event.page);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchValue.trim().length < 2) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Too short',
        detail: 'Please enter at least 2 characters',
        life: 2000,
      });
      return;
    }

    const filtered = artworks.filter((art) =>
      art.id.toString().toLowerCase().includes(searchValue.toLowerCase())
    );

    setFilteredArtworks(filtered);
    toast.current?.show({
      severity: 'info',
      summary: 'Search',
      detail: `Showing ${filtered.length} result(s) for "${searchValue}"`,
      life: 2000,
    });
    setShowSearchBox(false);
  };

  useEffect(() => {
    if (searchValue.trim().length < 2) {
      setFilteredArtworks(artworks);
      return;
    }

    const filtered = artworks.filter((art) =>
      art.id.toString().toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredArtworks(filtered);
  }, [searchValue, artworks]);




  const codeHeaderTemplate = () => (
    <div className="relative flex items-center justify-start gap-1">
      <p className="font-semibold text-sm flex items-center">
        Code
        <button
          type="button"
          onClick={() => setShowSearchBox(prev => !prev)}
          className="ml-1 p-1 text-gray-500 hover:text-gray-700"
          style={{ lineHeight: 0, background: 'transparent', border: 'none' }}
        >
          <FaChevronDown size={10} />
        </button>
      </p>

      {showSearchBox && (
        <div className="absolute top-7 left-0 bg-white border border-gray-300 rounded-lg shadow-xl p-4  w-72">
          <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3">
            <InputText
              placeholder="Select rows..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="p-inputtext-sm w-full"
            />
            <Button
              type="submit"
              label="Submit"
              size="small"
              className="w-full justify-center"
            />
          </form>
        </div>
      )}
    </div>
  );

  return (
    <div className=" bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <Toast ref={toast} />

      <DataTable
        value={filteredArtworks}
        loading={loading}
        className="p-datatable-sm"
        selectionMode="multiple"
        selection={artworks.filter(a => selectedRows[a.id])}
        onSelectionChange={(e) => {
          const selected = e.value as Artwork[];
          const newSelectedRows: SelectedRows = {};
          selected.forEach(a => {
            newSelectedRows[a.id] = true;
          });
          setSelectedRows(newSelectedRows);
        }}
        dataKey="id"
        scrollable
        scrollHeight="flex"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }} />
        <Column field="id" header={codeHeaderTemplate()} />
        <Column field="title" header="Name" />
        <Column field="artist_display" header="Category" />
      </DataTable>

      <Paginator
        first={currentPage * rowsPerPage}
        rows={rowsPerPage}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        className="border-t border-gray-200 pt-3 mt-3"
      />
    </div>
  );
};

export default DataTableComponent;
