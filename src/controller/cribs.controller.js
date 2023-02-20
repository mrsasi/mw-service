const Joi = require('joi');
const { isEmpty } = require('lodash');
const { Op } = require('sequelize');
const {
  models: { cribs },
} = require('../models');

exports.create = async (req, res) => {
  try {
    const { body } = req;
    const schema = Joi.object({
      name: Joi.string().required(),
      img: Joi.string().required(),
      location: Joi.string().required(),
    });
    const { name, img, location } = body;
    const validatedParams = await schema.validateAsync({
      name,
      img,
      location,
    });
    const data = await cribs.create({
      ...body,
      ...validatedParams,
    });
    return res.status(200).send({
      success: true,
      data,
      message: 'Inserted Successfully.',
    });
  } catch (err) {
    res.status(401).send({
      success: false,
      error: err.message || 'Something went to wrong',
    });
  }
  return '';
};

exports.update = async (req, res) => {
  try {
    const {
      params: { id },
      body,
    } = req;
    const schema = Joi.object({
      name: Joi.string().required(),
      img: Joi.string().required(),
      location: Joi.string().required(),
    });
    const { name, location, img } = body;
    const validatedParams = await schema.validateAsync({
      name,
      img,
      location,
    });
    const data = await cribs.update(
      { ...body, ...validatedParams },
      { where: { id } }
    );
    res.status(200).send({
      success: true,
      data,
      message: 'Updated Successfully.',
    });
  } catch (err) {
    res.status(401).send({
      success: false,
      error: err.message || 'Something went to wrong',
    });
  }
  return '';
};

exports.get = (req, res) => {
  const {
    params: { id },
  } = req;
  cribs
    .findOne({
      attributes: ['id', 'name', 'location', 'img'],
      where: {
        id,
      },
    })
    .then((data) => {
      res.status(200).send({ success: true, data });
    })
    .catch((error) => {
      res.status(401).send({
        success: false,
        error: error.message || 'Something went to wrong',
      });
    });
};

exports.getAll = (req, res) => {
  const {
    query: { search },
  } = req;
  const where = {};
  if (!isEmpty(search)) {
    where[Op.or] = {
      name: { [Op.like]: `%${search}%` },
      location: { [Op.like]: `%${search}%` },
    };
  }
  cribs
    .findAll({
      attributes: ['id', 'name', 'location', 'img'],
      where,
    })
    .then((data) => {
      res.status(200).send({ success: true, data });
    })
    .catch((error) => {
      res.status(401).send({
        success: false,
        error: error.message || 'Something went to wrong',
      });
    });
};

exports.delete = (req, res) => {
  const {
    params: { id },
  } = req;
  cribs
    .destroy({ where: { id } })
    .then(() => {
      res.status(200).send({
        success: true,
        message: 'Deleted Successfully.',
      });
    })
    .catch((error) => {
      res.status(401).send({
        success: false,
        error: error.message || 'Something went to wrong',
      });
    });
};
