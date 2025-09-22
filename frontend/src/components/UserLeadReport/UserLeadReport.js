import React, { useState, useEffect } from 'react';
import './UserLeadReport.css';
// import { getTeamMembersLeadReport } from '../../hooks/Dashboard/UseDashboardHook';
import { useQuery } from "react-query";
// Sample Data with Multiple Users and expanded status types
const users = [
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKu1w7TulWMUKGszjJlb7PDtn0LVSJgGnrog&s',
    role: 'Sales Executive',
    leads: [
      { id: 1, status: 'Hot', project: 'Project A' },
      { id: 2, status: 'Cold', project: 'Project B' },
      { id: 3, status: 'Not Interested', project: 'Project C' },
      { id: 4, status: 'Open', project: 'Project D' },
      { id: 5, status: 'Junk', project: 'Project E' },
      { id: 6, status: 'Hot', project: 'Project F' },
      { id: 7, status: 'Open', project: 'Project G' },
      { id: 8, status: 'Cold', project: 'Project H' },
    ],
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKu1w7TulWMUKGszjJlb7PDtn0LVSJgGnrog&s',
    role: 'Account Manager',
    leads: [
      { id: 1, status: 'Hot', project: 'Project X' },
      { id: 2, status: 'Cold', project: 'Project Y' },
      { id: 3, status: 'Not Interested', project: 'Project Z' },
      { id: 4, status: 'Open', project: 'Project W' },
      { id: 5, status: 'Junk', project: 'Project V' },
    ],
  },
  {
    id: 3,
    name: 'Michael Johnson',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKu1w7TulWMUKGszjJlb7PDtn0LVSJgGnrog&s',
    role: 'Business Developer',
    leads: [
      { id: 1, status: 'Not Interested', project: 'Project M' },
      { id: 2, status: 'Open', project: 'Project N' },
      { id: 3, status: 'Hot', project: 'Project O' },
      { id: 4, status: 'Cold', project: 'Project P' },
      { id: 5, status: 'Open', project: 'Project Q' },
      { id: 6, status: 'Junk', project: 'Project R' },
    ],
  },
  {
    id: 4,
    name: 'Emily Clark',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKu1w7TulWMUKGszjJlb7PDtn0LVSJgGnrog&s',
    role: 'Sales Representative',
    leads: [
      { id: 1, status: 'Cold', project: 'Project U' },
      { id: 2, status: 'Open', project: 'Project T' },
      { id: 3, status: 'Hot', project: 'Project S' },
      { id: 4, status: 'Not Interested', project: 'Project R' },
      { id: 5, status: 'Junk', project: 'Project Q' },
    ],
  },
];

// Group projects by project name and count status occurrences
const getProjectLeadStats = (leads) => {
  const projectMap = {};

  leads.forEach(lead => {
    if (!projectMap[lead.project]) {
      projectMap[lead.project] = {
        Hot: 0,
        Cold: 0,
        Open: 0,
        'Not Interested': 0,
        Junk: 0,
        total: 0
      };
    }

    if (projectMap[lead.project][lead.status] !== undefined) {
      projectMap[lead.project][lead.status]++;
      projectMap[lead.project].total++;
    }
  });

  return Object.entries(projectMap).map(([project, counts]) => ({
    project,
    ...counts
  }));
};

// Count total leads by status
const getStatusTotals = (leads) => {
  const counts = {
    Hot: 0,
    Cold: 0,
    Open: 0,
    'Not Interested': 0,
    Junk: 0,
    total: 0
  };

  leads.forEach(lead => {
    if (counts[lead.status] !== undefined) {
      counts[lead.status]++;
      counts.total++;
    }
  });

  return counts;
};

// Status badge component with color mapping
const StatusCount = ({ status, count }) => {
  const colorMap = {
    Hot: 'hot',
    Cold: 'cold',
    Open: 'open',
    'Not Interested': 'not-interested',
    Junk: 'junk'
  };

  return (
    <span className={`status-count ${colorMap[status]} ${count === 0 ? 'zero-count' : ''}`}>
      {count}
    </span>
  );
};

// ProjectTable component with search and pagination
const ProjectTable = ({ projects }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5);
  const [filteredProjects, setFilteredProjects] = useState(projects);

  // Filter projects based on search term
  useEffect(() => {
    const results = projects.filter(project =>
      project.project.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(results);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, projects]);

  // Get current projects for pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  // Calculate total pages
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Handle page navigation
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="projects-table-container">
      <div className="projects-header">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <div className="projects-count">
          {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
        </div>
      </div>

      <table className="projects-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Hot</th>
            <th>Cold</th>
            <th>Open</th>
            <th>Not Interested</th>
            <th>Junk</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects.length > 0 ? (
            currentProjects.map(project => (
              <tr key={project.project}>
                <td className="project-name">{project.project}</td>
                <td><StatusCount status="Hot" count={project.Hot} /></td>
                <td><StatusCount status="Cold" count={project.Cold} /></td>
                <td><StatusCount status="Open" count={project.Open} /></td>
                <td><StatusCount status="Not Interested" count={project['Not Interested']} /></td>
                <td><StatusCount status="Junk" count={project.Junk} /></td>
                <td className="project-total">{project.total}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-results">No projects found matching "{searchTerm}"</td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <div className="page-numbers">
            {pageNumbers.map(number => (
              <button
                key={number}
                className={`page-number ${currentPage === number ? 'active' : ''}`}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </button>
            ))}
          </div>

          <button
            className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const UserLeadReport = () => {
  const [expandedUserId, setExpandedUserId] = useState(null);

  const toggleExpand = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  // Sort users by total lead count (descending)
  const sortedUsers = [...users].sort((a, b) => {
    return b.leads.length - a.leads.length;
  });

  // const TeamMembersLeadReport = useQuery(["team-members-lead-report"], getTeamMembersLeadReport);

  // console.log(TeamMembersLeadReport.data, "TeamMembersLeadReport");

  return (
    <div className="team-table-container">
      <h4 className="team-table-title">Team Members Lead Report</h4>

      <div className="team-table-wrapper">
        <table className="team-table">
          <thead>
            <tr>
              <th className="th-member">Team Member</th>
              <th className="th-status">Hot</th>
              <th className="th-status">Cold</th>
              <th className="th-status">Open</th>
              <th className="th-status">Not Interested</th>
              <th className="th-status">Junk</th>
              <th className="th-total">Total Leads</th>
              <th className="th-action">Details</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map(user => {
              const statusTotals = getStatusTotals(user.leads);
              const isExpanded = expandedUserId === user.id;
              const projectStats = getProjectLeadStats(user.leads);
              console.log(user, "user")
              return (
                <React.Fragment key={user.id}>
                  <tr className={`team-row ${isExpanded ? 'expanded' : ''}`}>
                    <td className="member-cell">
                      <div className="member-info">
                        <img src={user.avatar} alt={user.name} className="member-avatar" />
                        <div className="member-details">
                          <div className="member-name">{user.name}</div>
                          <div className="member-role">{user.role}</div>
                        </div>
                      </div>
                    </td>
                    <td><StatusCount status="Hot" count={statusTotals.Hot} /></td>
                    <td><StatusCount status="Cold" count={statusTotals.Cold} /></td>
                    <td><StatusCount status="Open" count={statusTotals.Open} /></td>
                    <td><StatusCount status="Not Interested" count={statusTotals['Not Interested']} /></td>
                    <td><StatusCount status="Junk" count={statusTotals.Junk} /></td>
                    <td className="total-cell">{statusTotals.total}</td>
                    <td className="action-cell">
                      <button
                        className={`expand-button ${isExpanded ? 'expanded' : ''}`}
                        onClick={() => toggleExpand(user.id)}
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        <svg className="expand-icon" viewBox="0 0 24 24">
                          <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                        </svg>
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="projects-row">
                      <td colSpan="8">
                        <div className="expanded-content">
                          {/* <h4 className="projects-table-title">Projects Detail for {user.name}</h4> */}
                          <ProjectTable projects={projectStats} />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserLeadReport;
