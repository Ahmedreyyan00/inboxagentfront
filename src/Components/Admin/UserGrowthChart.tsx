"use client";

import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FaUsers, FaChartLine, FaArrowUp, FaChartBar, FaChartPie, FaChartArea } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface UserGrowthData {
  _id: {
    year: number;
    month: number;
  };
  count: number;
}

interface UserGrowthChartProps {
  data: UserGrowthData[];
  title: string;
}

const chartTypes = [
  { id: 'line', name: 'Line Chart', icon: FaChartLine, description: 'Trend line analysis' },
  { id: 'area', name: 'Area Chart', icon: FaChartArea, description: 'Smooth area visualization' },
  { id: 'bar', name: 'Bar Chart', icon: FaChartBar, description: 'Monthly comparison' },
  { id: 'doughnut', name: 'Doughnut Chart', icon: FaChartPie, description: 'Distribution view' },
];

export default function UserGrowthChart({ data, title }: UserGrowthChartProps) {
  const [activeChartType, setActiveChartType] = useState('line');

  // Transform data for better chart display
  const chartData = data.map(item => ({
    name: `${getMonthName(item._id.month)} ${item._id.year}`,
    users: item.count,
    month: item._id.month,
    year: item._id.year,
  })).sort((a, b) => {
    // Sort by year and month
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  const totalUsers = chartData.reduce((sum, item) => sum + item.users, 0);
  const growthRate = chartData.length > 1 
    ? ((chartData[chartData.length - 1].users - chartData[chartData.length - 2].users) / chartData[chartData.length - 2].users * 100).toFixed(1)
    : 0;

  // Chart.js data configuration
  const chartConfig = {
    labels: chartData.map(item => item.name),
    datasets: [
      {
        label: 'Users',
        data: chartData.map(item => item.users),
        borderColor: '#3B82F6',
        backgroundColor: activeChartType === 'area' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.8)',
        borderWidth: 3,
        fill: activeChartType === 'area',
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#3B82F6',
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 3,
      },
    ],
  };

  // Chart.js options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937',
        bodyColor: '#3B82F6',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: any) => context[0].label,
          label: (context: any) => `Users: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#E5E7EB',
          borderDash: [3, 3],
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
          callback: (value: any) => value,
        },
        border: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  // Doughnut chart data for distribution view
  const doughnutData = {
    labels: chartData.map(item => item.name),
    datasets: [
      {
        data: chartData.map(item => item.users),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#06B6D4',
          '#84CC16',
          '#F97316',
          '#EC4899',
          '#14B8A6',
        ],
        borderWidth: 2,
        borderColor: '#FFFFFF',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937',
        bodyColor: '#3B82F6',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed} users`,
        },
      },
    },
  };

  const renderChart = () => {
    switch (activeChartType) {
      case 'line':
        return <Line data={chartConfig} options={chartOptions} />;
      case 'area':
        return <Line data={chartConfig} options={chartOptions} />;
      case 'bar':
        return <Bar data={chartConfig} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={doughnutData} options={doughnutOptions} />;
      default:
        return <Line data={chartConfig} options={chartOptions} />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FaUsers className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">User registration trends</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <FaArrowUp className="text-green-500" />
            <span className="text-sm font-medium text-green-600">
              {growthRate}% growth
            </span>
          </div>
          <p className="text-xs text-gray-500">vs last month</p>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {chartTypes.map((chartType) => {
          const Icon = chartType.icon;
          const isActive = activeChartType === chartType.id;
          
          return (
            <button
              key={chartType.id}
              onClick={() => setActiveChartType(chartType.id)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm' 
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-700'
                }
              `}
              title={chartType.description}
            >
              <Icon className="text-sm" />
              <span>{chartType.name}</span>
            </button>
          );
        })}
      </div>

      {chartData.length > 0 ? (
        <div className="space-y-6">
          {/* Main Chart */}
          <div className="h-80">
            {renderChart()}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <FaUsers className="text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total Users</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalUsers}</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <FaArrowUp className="text-green-600" />
                <span className="text-sm font-medium text-green-900">Growth Rate</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-1">{growthRate}%</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <FaChartLine className="text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Period</span>
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-1">{chartData.length}</p>
              <p className="text-xs text-purple-700">months</p>
            </div>
          </div>

          {/* Additional Insights */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Key Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Peak Month: </span>
                <span className="font-medium text-gray-900">
                  {chartData.length > 0 ? chartData.reduce((max, item) => item.users > max.users ? item : max).name : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Average Monthly Growth: </span>
                <span className="font-medium text-gray-900">
                  {chartData.length > 1 
                    ? ((chartData[chartData.length - 1].users - chartData[0].users) / (chartData.length - 1)).toFixed(1)
                    : '0'
                  } users/month
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <FaChartLine className="text-gray-400 text-4xl mx-auto mb-4" />
            <p className="text-gray-600">No user growth data available</p>
            <p className="text-sm text-gray-500">Data will appear here once users start registering</p>
          </div>
        </div>
      )}
    </div>
  );
}

function getMonthName(month: number): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return months[month - 1] || '';
}
